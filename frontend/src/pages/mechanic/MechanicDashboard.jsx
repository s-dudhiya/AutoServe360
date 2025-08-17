import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RealtimeWidget } from "@/components/dashboard/RealtimeWidget";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { WorkflowManager } from "@/components/dashboard/WorkflowManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Zap,
  Kanban,
  ClipboardList,
  BarChart3,
  User,
  Settings
} from "lucide-react";
import { getJobsByMechanic, getCurrentUser, mockJobCards } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MechanicDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const myJobs = getJobsByMechanic(currentUser.name);
  const [activeJobId, setActiveJobId] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [selectedJob, setSelectedJob] = useState(null);

  const activeJobs = myJobs.filter(job => job.status !== 'Completed').length;
  const completedJobs = myJobs.filter(job => job.status === 'Completed').length;
  const inProgressJobs = myJobs.filter(job => job.status === 'Under Service').length;
  const queuedJobs = myJobs.filter(job => job.status === 'In Queue').length;

  const handleStartJob = (jobId) => {
    setActiveJobId(jobId);
  };

  const handleStopJob = () => {
    setActiveJobId(null);
  };

  const handleMoveJob = (jobId, newStatus) => {
    // In real app, this would update the job status via API
    console.log(`Moving job ${jobId} to ${newStatus}`);
  };

  const currentJob = selectedJob ? myJobs.find(job => job.id === selectedJob) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 space-y-8">
          {/* Modern Mechanic Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center animate-pulse">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-modern bg-clip-text text-transparent">
                    My Workshop
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Welcome back, <span className="text-secondary font-semibold">{currentUser.name}</span>!
                  </p>
                </div>
                <Badge className="bg-gradient-accent text-primary font-semibold animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  {activeJobs} Active Jobs
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {activeJobId && (
                <Button 
                  variant="outline" 
                  onClick={handleStopJob} 
                  className="border-2 border-warning text-warning hover:bg-warning/10 transition-all duration-300 transform hover:scale-105"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Timer
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Tools
              </Button>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value)} className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-muted/30">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-accent data-[state=active]:text-primary"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="my-jobs"
                className="data-[state=active]:bg-gradient-modern data-[state=active]:text-secondary"
              >
                <Kanban className="h-4 w-4 mr-2" />
                My Jobs
              </TabsTrigger>
              <TabsTrigger 
                value="workflow"
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Workflow
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-8">
              {/* Modern Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <RealtimeWidget
                  title="Active Jobs"
                  value={activeJobs}
                  icon={Wrench}
                  change="Your workload"
                  trend="neutral"
                  color="primary"
                />
                <RealtimeWidget
                  title="In Progress"
                  value={inProgressJobs}
                  icon={Timer}
                  change={activeJobId ? "Timer running" : "Ready to start"}
                  trend="up"
                  color="warning"
                />
                <RealtimeWidget
                  title="In Queue"
                  value={queuedJobs}
                  icon={AlertCircle}
                  change="Waiting for you"
                  trend="neutral"
                  color="secondary"
                />
                <RealtimeWidget
                  title="Completed"
                  value={completedJobs}
                  icon={CheckCircle}
                  change="Well done!"
                  trend="up"
                  color="success"
                />
              </div>

              {/* Modern Active Job Timer */}
              {activeJobId && (
                <Card className="border-0 shadow-glow bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-modern opacity-5"></div>
                  <CardHeader className="relative z-10 border-b border-primary/20">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center animate-pulse">
                          <Timer className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-primary">Active Job Timer</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-success/20 text-success border-success/30">
                              <div className="w-2 h-2 bg-success rounded-full mr-1 animate-ping"></div>
                              Recording
                            </Badge>
                            <Badge variant="outline" className="text-primary border-primary/30">
                              Job #{activeJobId}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <div>
                          <p className="text-lg font-semibold text-foreground">Current Session</p>
                          <p className="text-muted-foreground">Started at 10:30 AM</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-success" />
                            <span className="text-sm text-muted-foreground">Target: 3.5 hours</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-gradient-accent h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center md:text-right">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-modern rounded-full shadow-glow">
                          <div className="text-center">
                            <p className="text-3xl font-black text-secondary">02:45:30</p>
                            <p className="text-xs text-primary/70 font-medium">ELAPSED</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Hours : Minutes : Seconds</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Job Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJobs.slice(0, 3).map((job) => (
                  <Card key={job.id} className="border-0 shadow-medium bg-gradient-card hover:shadow-glow transition-all duration-300 cursor-pointer" onClick={() => {setSelectedJob(job.id); setActiveView('workflow')}}>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge className={
                            job.status === 'Under Service' ? 'bg-warning/20 text-warning' :
                            job.status === 'In Queue' ? 'bg-secondary/20 text-secondary' :
                            job.status === 'Completed' ? 'bg-success/20 text-success' :
                            'bg-primary/20 text-primary'
                          }>
                            {job.status}
                          </Badge>
                          <span className="text-sm font-mono text-muted-foreground">#{job.id}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{job.customerName}</h3>
                          <p className="text-sm text-muted-foreground">{job.vehicleBrand} {job.vehicleModel}</p>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                          {job.serviceType}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* My Jobs Kanban Tab */}
            <TabsContent value="my-jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">My Job Queue</h2>
                  <p className="text-muted-foreground">Manage your assigned jobs</p>
                </div>
              </div>
              <KanbanBoard 
                jobs={myJobs} 
                onMoveJob={handleMoveJob}
                viewType="mechanic"
              />
            </TabsContent>

            {/* Detailed Workflow Tab */}
            <TabsContent value="workflow" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Job Workflow</h2>
                  <p className="text-muted-foreground">Step-by-step job completion</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Select Job:</span>
                  <select 
                    value={selectedJob || ''} 
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="px-3 py-1 border border-border rounded-md bg-background text-foreground"
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
                <WorkflowManager 
                  job={currentJob} 
                  userRole="mechanic"
                />
              ) : (
                <Card className="border-0 shadow-medium bg-gradient-card">
                  <CardContent className="p-12 text-center">
                    <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Select a Job to Begin</h3>
                    <p className="text-muted-foreground">Choose a job from the dropdown above to view the detailed workflow</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

        </main>
      </div>
    </div>
  );
}
