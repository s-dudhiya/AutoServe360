import { useState } from "react";
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
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Activity,
  Timer,
  Target,
  Kanban,
  ClipboardList,
  BarChart3,
  Settings,
  Bike,
} from "lucide-react";
import {
  getJobsByMechanic,
  getCurrentUser,
} from "@/utils/mockData";
import { useNavigate } from "react-router-dom";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { WorkflowManager } from "@/components/dashboard/WorkflowManager";

// This component is now clean. It ONLY renders the content for the Mechanic Dashboard page.
// All layout is handled by MainLayout.jsx.
export default function MechanicDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const myJobs = getJobsByMechanic(currentUser.name);
  const [activeJobId, setActiveJobId] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [selectedJob, setSelectedJob] = useState(myJobs.length > 0 ? myJobs[0].id : null);

  const activeJobs = myJobs.filter((job) => job.status !== "Completed").length;
  const completedJobs = myJobs.filter(
    (job) => job.status === "Completed"
  ).length;
  const inProgressJobs = myJobs.filter(
    (job) => job.status === "Under Service"
  ).length;
  const queuedJobs = myJobs.filter((job) => job.status === "In Queue").length;

  const handleStartJob = (jobId) => {
    setActiveJobId(jobId);
  };

  const handleStopJob = () => {
    setActiveJobId(null);
  };

  const handleMoveJob = (jobId, newStatus) => {
    console.log(`Moving job ${jobId} to ${newStatus}`);
    // Here you would typically update the state of your jobs
  };

  const currentJob = selectedJob
    ? myJobs.find((job) => job.id === selectedJob)
    : null;

  return (
    // The component now returns a single div with its content.
    // All Sidebar, Navbar, and layout state has been removed.
    <div className="w-full space-y-8">
      {/* Modern Mechanic Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <Bike className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
              My Workshop
            </h1>
            <p className="text-lg text-gray-400">
              Welcome back,{" "}
              <span className="text-yellow-400 font-semibold">
                {currentUser.name}
              </span>
              !
            </p>
          </div>
          <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 font-semibold animate-pulse ml-4">
            <Activity className="w-3 h-3 mr-1" />
            {activeJobs} Active Jobs
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          {activeJobId && (
            <Button
              variant="outline"
              onClick={handleStopJob}
              className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400/10 transition-all duration-300 transform hover:scale-105"
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop Timer
            </Button>
          )}
          <Button
            variant="outline"
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Tools
          </Button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="my-jobs"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"
          >
            <Kanban className="h-4 w-4 mr-2" />
            My Jobs
          </TabsTrigger>
          <TabsTrigger
            value="workflow"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Workflow
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Active Jobs</p>
                    <p className="text-3xl font-bold text-white">{activeJobs}</p>
                    <p className="text-gray-400 text-sm">Your workload</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-white">{inProgressJobs}</p>
                    <p className="text-orange-400 text-sm">{activeJobId ? "Timer running" : "Ready to start"}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center">
                    <Timer className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">In Queue</p>
                    <p className="text-3xl font-bold text-white">{queuedJobs}</p>
                    <p className="text-blue-400 text-sm">Waiting for you</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-white">{completedJobs}</p>
                    <p className="text-green-400 text-sm">Well done!</p>
                  </div>
                  <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Jobs Kanban Tab */}
        <TabsContent value="my-jobs" className="space-y-6 mt-6">
            <KanbanBoard 
              jobs={myJobs} 
              onMoveJob={handleMoveJob}
              viewType="mechanic"
            />
        </TabsContent>

        {/* Detailed Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">Job Workflow</h2>
              <p className="text-gray-400">Step-by-step job completion</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Select Job:</span>
              <select 
                value={selectedJob || ''} 
                onChange={(e) => setSelectedJob(e.target.value)}
                className="px-3 py-1 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="">Choose a job...</option>
                {myJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    #{job.id} - {job.customerName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {currentJob ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <WorkflowManager 
                job={currentJob} 
                userRole="mechanic"
              />
            </div>
          ) : (
            <Card className="bg-gray-800 border border-gray-700 shadow-lg">
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Select a Job to Begin</h3>
                <p className="text-gray-400">Choose a job from the dropdown above to view the detailed workflow</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
