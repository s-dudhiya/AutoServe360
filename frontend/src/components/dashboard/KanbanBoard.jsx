import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  Phone, 
  Car, 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Timer,
  Wrench,
  Package
} from "lucide-react";

const statusConfig = {
  'In Queue': {
    title: 'In Queue',
    icon: Timer,
    color: 'bg-secondary/10 text-secondary border-secondary/20',
    headerBg: 'bg-secondary/5',
    count: 0
  },
  'Under Service': {
    title: 'Under Service',
    icon: Wrench,
    color: 'bg-warning/10 text-warning border-warning/20',
    headerBg: 'bg-warning/5',
    count: 0
  },
  'Awaiting Parts': {
    title: 'Awaiting Parts',
    icon: Package,
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    headerBg: 'bg-destructive/5',
    count: 0
  },
  'QC': {
    title: 'Quality Check',
    icon: CheckCircle,
    color: 'bg-primary/10 text-primary border-primary/20',
    headerBg: 'bg-primary/5',
    count: 0
  },
  'Completed': {
    title: 'Completed',
    icon: CheckCircle,
    color: 'bg-success/10 text-success border-success/20',
    headerBg: 'bg-success/5',
    count: 0
  }
};

export  function KanbanBoard({ jobs, onMoveJob, viewType }) {
  const jobsByStatus = jobs.reduce((acc, job) => {
    if (!acc[job.status]) acc[job.status] = [];
    acc[job.status].push(job);
    return acc;
  }, {});

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeSince = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-destructive text-destructive-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-16rem)] overflow-hidden">
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusJobs = jobsByStatus[status] || [];
        const StatusIcon = config.icon;
        
        return (
          <Card key={status} className="flex flex-col border-0 shadow-medium bg-gradient-card">
            <CardHeader className={`pb-4 ${config.headerBg} border-b border-border/20`}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color.replace('text-', 'bg-').replace('/10', '/20')}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-bold">{config.title}</span>
                </div>
                <Badge variant="outline" className={config.color}>
                  {statusJobs.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {statusJobs.map((job) => (
                <Card key={job.id} className="border border-border/40 hover:border-primary/40 transition-colors duration-200 hover:shadow-glow cursor-pointer">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-foreground">#{job.id}</span>
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-foreground">{job.customerName}</h4>
                      </div>
                      {status === 'Under Service' && (
                        <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Car className="h-3 w-3" />
                        <span>{job.vehicleBrand} {job.vehicleModel}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{job.vehicleNumber}</span>
                      </div>
                      {viewType === 'admin' && job.assignedMechanic && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="text-xs">{job.assignedMechanic}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/20">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeSince(job.createdAt)}</span>
                        </div>
                        <span>ETA: {formatTime(job.estimatedCompletion)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                      {job.serviceType}
                    </div>

                    {/* Action Buttons for Status Changes */}
                    {onMoveJob && status !== 'Completed' && (
                      <div className="pt-2">
                        {status === 'In Queue' && (
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-accent text-primary hover:shadow-glow transition-all duration-300"
                            onClick={() => onMoveJob(job.id, 'Under Service')}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Start Service
                          </Button>
                        )}
                        {status === 'Under Service' && (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs border-warning text-warning hover:bg-warning/10"
                              onClick={() => onMoveJob(job.id, 'Awaiting Parts')}
                            >
                              Need Parts
                            </Button>
                            <Button 
                              size="sm"
                              className="text-xs bg-gradient-modern text-secondary hover:shadow-glow"
                              onClick={() => onMoveJob(job.id, 'QC')}
                            >
                              To QC
                            </Button>
                          </div>
                        )}
                        {(status === 'Awaiting Parts' || status === 'QC') && (
                          <Button 
                            size="sm" 
                            className="w-full bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => onMoveJob(job.id, 'Completed')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {statusJobs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <StatusIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No jobs in {config.title.toLowerCase()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
