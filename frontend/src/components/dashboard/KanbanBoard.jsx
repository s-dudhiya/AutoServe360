import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  User, 
  Car, 
  ArrowRight,
  CheckCircle,
  Timer,
  Wrench,
  Package,
  Search // Import the search icon
} from "lucide-react";

// Updated status configuration to match the new dark theme
const statusConfig = {
  'In Queue': {
    title: 'In Queue',
    icon: Timer,
    color: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
    headerBg: 'bg-gray-900/50',
  },
  'Under Service': {
    title: 'Under Service',
    icon: Wrench,
    color: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
    headerBg: 'bg-gray-900/50',
  },
  'Awaiting Parts': {
    title: 'Awaiting Parts',
    icon: Package,
    color: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
    headerBg: 'bg-gray-900/50',
  },
  'QC': {
    title: 'Quality Check',
    icon: CheckCircle,
    color: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
    headerBg: 'bg-gray-900/50',
  },
};

export function KanbanBoard({ jobs, onMoveJob, viewType }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(job =>
    job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const jobsByStatus = filteredJobs.reduce((acc, job) => {
    if (!acc[job.status]) acc[job.status] = [];
    acc[job.status].push(job);
    return acc;
  }, {});

  const getTimeSince = (dateString) => {
    if (!dateString) return 'N/A';
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 23) return `${Math.floor(hours/24)}d ago`;
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search jobs by ID, customer, or vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-yellow-400"
        />
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {Object.entries(statusConfig).map(([status, config]) => {
          const statusJobs = jobsByStatus[status] || [];
          const StatusIcon = config.icon;
          
          return (
            <Card key={status} className="flex flex-col bg-gray-800 border border-gray-700 shadow-lg h-full">
              <CardHeader className={`pb-4 ${config.headerBg} border-b border-gray-700`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold text-white">{config.title}</span>
                  </div>
                  <Badge variant="outline" className={config.color}>
                    {statusJobs.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-28rem)]">
                {statusJobs.map((job) => (
                  <Card key={job.id} className="bg-gray-900/50 border border-gray-700 hover:border-yellow-400/50 transition-colors duration-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="font-semibold text-white">#{job.id}</span>
                          <h4 className="font-medium text-gray-300">{job.customerName}</h4>
                        </div>
                        {status === 'Under Service' && (
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="In Progress"></div>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Car className="h-4 w-4" />
                          <span>{job.vehicleBrand} {job.vehicleModel}</span>
                        </div>
                         <div className="flex items-center space-x-2 text-gray-400">
                          <span className="font-mono text-xs bg-gray-700 px-2 py-1 rounded">{job.vehicleNumber}</span>
                        </div>
                        {viewType === 'admin' && job.assignedMechanic && (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <User className="h-4 w-4" />
                            <span className="text-xs">{job.assignedMechanic}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeSince(job.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* --- THIS IS THE FIX --- */}
                      {/* The buttons will now only render if the viewType is 'mechanic' */}
                      {onMoveJob && viewType === 'mechanic' && (
                        <div className="pt-2">
                          {status === 'In Queue' && (
                            <Button size="sm" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-md" onClick={() => onMoveJob(job.id, 'Under Service')}>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Start Service
                            </Button>
                          )}
                          {status === 'Under Service' && (
                            <div className="grid grid-cols-2 gap-2">
                              <Button size="sm" variant="outline" className="text-xs border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10" onClick={() => onMoveJob(job.id, 'Awaiting Parts')}>Need Parts</Button>
                              <Button size="sm" className="text-xs bg-blue-500 hover:bg-blue-600 text-white" onClick={() => onMoveJob(job.id, 'QC')}>To QC</Button>
                            </div>
                          )}
                          {(status === 'Awaiting Parts' || status === 'QC') && (
                            <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => onMoveJob(job.id, 'Completed')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete Job
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {statusJobs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <StatusIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No jobs in {config.title.toLowerCase()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
