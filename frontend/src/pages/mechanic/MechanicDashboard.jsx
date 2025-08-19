import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Timer,
  Kanban,
  ClipboardList,
  BarChart3,
  Settings,
  Bike,
  Loader2,
  IndianRupee, // Import the Rupee icon
  DollarSign,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { WorkflowManager } from "@/components/dashboard/WorkflowManager";

const KpiCardSkeleton = () => (
  <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-6 animate-pulse">
    <div className="flex items-center justify-between"><div><div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div><div className="h-8 bg-gray-700 rounded w-1/2"></div></div><div className="w-12 h-12 bg-gray-700 rounded-lg"></div></div>
  </div>
);

export default function MechanicDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [myJobs, setMyJobs] = useState([]);
  const [mechanicEarnings, setMechanicEarnings] = useState(0); // New state for earnings
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeView, setActiveView] = useState("overview");
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  const [detailedJob, setDetailedJob] = useState(null);
  const [workflowIsLoading, setWorkflowIsLoading] = useState(false);

  const statusMap = {
    queue: "In Queue", service: "Under Service", parts: "Awaiting Parts",
    qc: "QC", done: "Completed",
  };

  const fetchMyJobs = async () => {
      if (!user || !user.id) {
        setError("Could not identify the logged-in mechanic. Please log in again.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/my-jobs/?mechanic_id=${user.id}`);
        
        const transformedData = response.data.jobs.map(job => ({
          ...job,
          id: job.id.toString(), status: statusMap[job.status] || job.status,
          customerName: job.customer?.name || 'N/A', vehicleNumber: job.vehicle?.registration_no || 'N/A',
          vehicleBrand: job.vehicle?.make || 'N/A', vehicleModel: job.vehicle?.model || 'N/A',
        }));
        setMyJobs(transformedData);
        setMechanicEarnings(response.data.earnings);
        
        const firstActiveJob = transformedData.find(job => job.status !== "Completed");
        if (!selectedJobId && firstActiveJob) {
          setSelectedJobId(firstActiveJob.id);
        }
      } catch (err) {
        setError("Failed to fetch your jobs. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (authLoading) return;
    fetchMyJobs();
  }, [user, authLoading]);

  const fetchDetailedJob = async () => {
    if (selectedJobId) {
      setWorkflowIsLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/jobcards/${selectedJobId}/`);
        setDetailedJob(response.data);
      } catch (err) {
        console.error("Failed to fetch detailed job:", err);
        setDetailedJob(null);
      } finally {
        setWorkflowIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDetailedJob();
  }, [selectedJobId]);

  const handleDataRefresh = () => {
    fetchMyJobs();
    fetchDetailedJob();
  };

  const handleMoveJob = async (jobId, newStatus) => {
    const backendStatusKey = Object.keys(statusMap).find(key => statusMap[key] === newStatus);
    if (!backendStatusKey) {
        toast.error("Invalid status update.");
        return;
    }
    const originalJobs = [...myJobs];
    const updatedJobs = myJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
    );
    setMyJobs(updatedJobs);
    try {
        await axios.patch(`http://127.0.0.1:8000/api/jobcards/${jobId}/update-status/`, {
            status: backendStatusKey,
        });
        toast.success(`Job #${jobId} moved to "${newStatus}"`);
    } catch (err) {
        setMyJobs(originalJobs);
        toast.error("Failed to update job status.");
        console.error(err);
    }
  };

  const activeJobs = myJobs.filter((job) => job.status !== "Completed").length;
  const completedJobs = myJobs.filter((job) => job.status === "Completed").length;
  const inProgressJobs = myJobs.filter((job) => job.status === "Under Service").length;
  const queuedJobs = myJobs.filter((job) => job.status === "In Queue").length;
  
  const activeJobsForDropdown = myJobs.filter(job => job.status !== "Completed");

  if (authLoading) {
    return ( <div className="w-full flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div> );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center"><Bike className="h-6 w-6 text-gray-900" /></div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text py-1 leading-tight">Manage Work</h1>
            <p className="text-lg text-gray-400 -mt-1">Welcome back, <span className="text-yellow-400 font-semibold">{user?.full_name || "Mechanic"}</span>!</p>
          </div>
          <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 font-semibold animate-pulse ml-4"><Activity className="w-3 h-3 mr-1" />{activeJobs} Active Jobs</Badge>
        </div>
        {/* <div className="flex items-center space-x-3"><Button variant="outline" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"><Settings className="h-4 w-4 mr-2" />Tools</Button></div> */}
      </div>
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-gray-800 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"><BarChart3 className="h-4 w-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="my-jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"><Kanban className="h-4 w-4 mr-2" />My Jobs</TabsTrigger>
          <TabsTrigger value="workflow" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"><ClipboardList className="h-4 w-4 mr-2" />Workflow</TabsTrigger>
        </TabsList>
        {isLoading ? (<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><KpiCardSkeleton /><KpiCardSkeleton /><KpiCardSkeleton /><KpiCardSkeleton /><KpiCardSkeleton /></div>) : error ? (<Card className="mt-6 bg-red-500/10 border border-red-500/30"><CardContent className="text-center py-12"><AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-red-400 mb-2">An Error Occurred</h3><p className="text-gray-400">{error}</p></CardContent></Card>) : (
        <>
        <TabsContent value="overview" className="space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border border-gray-700"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm font-medium">Active Jobs</p><p className="text-3xl font-bold text-white">{activeJobs}</p></div><div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center"><Wrench className="h-6 w-6 text-yellow-400" /></div></div></CardContent></Card>
            <Card className="bg-gray-800 border border-gray-700"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm font-medium">In Progress</p><p className="text-3xl font-bold text-white">{inProgressJobs}</p></div><div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center"><Timer className="h-6 w-6 text-orange-400" /></div></div></CardContent></Card>
            <Card className="bg-gray-800 border border-gray-700"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm font-medium">In Queue</p><p className="text-3xl font-bold text-white">{queuedJobs}</p></div><div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center"><AlertCircle className="h-6 w-6 text-blue-400" /></div></div></CardContent></Card>
            <Card className="bg-gray-800 border border-gray-700"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm font-medium">Completed</p><p className="text-3xl font-bold text-white">{completedJobs}</p></div><div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center"><CheckCircle className="h-6 w-6 text-green-400" /></div></div></CardContent></Card>
            <Card className="bg-gray-800 border border-gray-700">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">My Earnings</p>
                            <p className="text-3xl font-bold text-white flex items-center">
                                <IndianRupee className="h-6 w-6 mr-1" />
                                {parseFloat(mechanicEarnings || 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="my-jobs" className="space-y-6 mt-6"><KanbanBoard jobs={myJobs} onMoveJob={handleMoveJob} viewType="mechanic"/></TabsContent>
        <TabsContent value="workflow" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-2xl font-bold text-yellow-400">Job Workflow</h2><p className="text-gray-400">Step-by-step job completion</p></div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Select Job:</span>
              <select value={selectedJobId || ''} onChange={(e) => setSelectedJobId(e.target.value)} className="px-3 py-1 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:border-yellow-400">
                <option value="">Choose a job...</option>
                {activeJobsForDropdown.map((job) => (<option key={job.id} value={job.id}>#{job.id} - {job.customerName}</option>))}
              </select>
            </div>
          </div>
          {workflowIsLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>
          ) : detailedJob ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6"><WorkflowManager job={detailedJob} userRole="mechanic" onUpdate={handleDataRefresh} /></div>
          ) : (
            <Card className="bg-gray-800 border border-gray-700 shadow-lg"><CardContent className="p-12 text-center"><ClipboardList className="h-16 w-16 mx-auto text-gray-600 mb-4" /><h3 className="text-xl font-semibold text-yellow-400 mb-2">No Job Selected</h3><p className="text-gray-400">{myJobs.length > 0 ? "Choose a job from the dropdown to view the workflow." : "You have no jobs assigned to you."}</p></CardContent></Card>
          )}
        </TabsContent>
        </>
        )}
      </Tabs>
    </div>
  );
}
