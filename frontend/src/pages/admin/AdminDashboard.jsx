import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Package,
  Clock,
  DollarSign,
  Plus,
  AlertTriangle,
  Activity,
  Zap,
  BarChart3,
  Users,
  Eye,
  Kanban,
  TrendingUp,
  Settings,
  Bell,
  Bike,
  Wrench,
  Cog,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";

const KpiCardSkeleton = () => (
  <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 animate-pulse">
    <div className="flex items-center justify-between"><div><div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div><div className="h-8 bg-gray-700 rounded w-1/2"></div></div><div className="w-12 h-12 bg-gray-700 rounded-lg"></div></div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State for all dynamic data
  const [jobs, setJobs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- NEW: State to hold the count of jobs created today ---
  const [jobsCreatedToday, setJobsCreatedToday] = useState(0);
  const [activeJobsChange, setActiveJobsChange] = useState({ value: 0, trend: 'neutral' });

  const [activeView, setActiveView] = useState("overview");

  const statusMap = {
    queue: "In Queue", service: "Under Service", parts: "Awaiting Parts",
    qc: "QC", done: "Completed",
  };

  // Fetch all necessary data when the component mounts
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [jobsResponse, partsResponse] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/jobcards/"),
        axios.get("http://127.0.0.1:8000/api/parts/")
      ]);

      const transformedJobs = jobsResponse.data.map(job => ({
        ...job,
        id: job.id.toString(),
        status: statusMap[job.status] || job.status,
        customerName: job.customer?.name || 'N/A',
        vehicleNumber: job.vehicle?.registration_no || 'N/A',
        vehicleBrand: job.vehicle?.make || 'N/A',
        vehicleModel: job.vehicle?.model || 'N/A',
      }));
      
      setJobs(transformedJobs);
      setInventory(partsResponse.data);

    } catch (err) {
      setError("Failed to fetch dashboard data. Please ensure the server is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Effect to calculate the percentage change in new jobs
  useEffect(() => {
    if (jobs.length > 0) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const todayCount = jobs.filter(job => job.created_at.startsWith(todayStr)).length;
        const yesterdayCount = jobs.filter(job => job.created_at.startsWith(yesterdayStr)).length;
        
        // --- NEW: Set the state for today's job count ---
        setJobsCreatedToday(todayCount);

        if (yesterdayCount > 0) {
            const change = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
            setActiveJobsChange({
                value: Math.abs(change),
                trend: change >= 0 ? 'up' : 'down'
            });
        } else if (todayCount > 0) {
            setActiveJobsChange({ value: 100, trend: 'up' });
        } else {
            setActiveJobsChange({ value: 0, trend: 'neutral' });
        }
    }
  }, [jobs]);

  const handleMoveJob = async (jobId, newStatus) => {
    const backendStatusKey = Object.keys(statusMap).find(key => statusMap[key] === newStatus);
    if (!backendStatusKey) {
        toast.error("Invalid status update.");
        return;
    }
    const originalJobs = [...jobs];
    const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);
    try {
        await axios.patch(`http://127.0.0.1:8000/api/jobcards/${jobId}/update-status/`, {
            status: backendStatusKey,
        });
        toast.success(`Job #${jobId} moved to "${newStatus}"`);
    } catch (err) {
        setJobs(originalJobs);
        toast.error("Failed to update job status.");
        console.error(err);
    }
  };

  // Calculate stats dynamically from the fetched data
  const lowStockItems = inventory.filter(item => item.stock_quantity <= 5).length;
  const jobsInQueue = jobs.filter(job => job.status === 'In Queue').length;
  const jobsAwaitingParts = jobs.filter(job => job.status === 'Awaiting Parts').length;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <Bike className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
              Garage Control Center
            </h1>
            <p className="text-gray-400 text-lg">
              Real-time two-wheeler service operations & analytics
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          
          <Button 
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Service Job
          </Button>
        </div>
      </div>

      {/* View Switcher Tabs (Simplified) */}
      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-sm grid-cols-2 bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="kanban"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"
          >
            <Kanban className="h-4 w-4 mr-2" />
            Workflow
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCardSkeleton /><KpiCardSkeleton /><KpiCardSkeleton /><KpiCardSkeleton />
          </div>
        ) : error ? (
          <Card className="mt-6 bg-red-500/10 border border-red-500/30"><CardContent className="text-center py-12"><AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-red-400 mb-2">An Error Occurred</h3><p className="text-gray-400">{error}</p></CardContent></Card>
        ) : (
          <>
            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-8 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* --- THIS CARD IS NOW UPDATED --- */}
                <Card className="bg-gray-800 border border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Jobs Created Today</p>
                        <p className="text-3xl font-bold text-white">{jobsCreatedToday}</p>
                        <p className={`text-sm flex items-center ${activeJobsChange.trend === 'up' ? 'text-green-400' : activeJobsChange.trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>
                          {activeJobsChange.trend !== 'neutral' && (
                            <TrendingUp className={`h-4 w-4 mr-1 ${activeJobsChange.trend === 'down' ? 'rotate-180' : ''}`} />
                          )}
                          {activeJobsChange.value.toFixed(1)}% vs yesterday
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                        <Bike className="h-6 w-6 text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border border-gray-700"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm font-medium">Jobs In Queue</p><p className="text-3xl font-bold text-white">{jobsInQueue}</p></div><div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center"><Clock className="h-6 w-6 text-blue-400" /></div></div></CardContent></Card>
                <Card className="bg-gray-800 border border-gray-700"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm font-medium">Awaiting Parts</p><p className="text-3xl font-bold text-white">{jobsAwaitingParts}</p></div><div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center"><Package className="h-6 w-6 text-orange-400" /></div></div></CardContent></Card>
                <Card className="bg-gray-800 border border-gray-700"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm font-medium">Low Stock Items</p><p className="text-3xl font-bold text-white">{lowStockItems}</p></div><div className="w-12 h-12 bg-red-400/20 rounded-lg flex items-center justify-center"><AlertTriangle className="h-6 w-6 text-red-400" /></div></div></CardContent></Card>
              </div>
            </TabsContent>

            {/* Kanban Workflow Tab */}
            <TabsContent value="kanban" className="space-y-6 mt-6">
              <KanbanBoard 
                jobs={jobs} 
                onMoveJob={handleMoveJob}
                viewType="admin"
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
