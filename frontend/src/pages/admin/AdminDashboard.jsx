import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RealtimeWidget } from "@/components/dashboard/RealtimeWidget";
import { LiveActivity } from "@/components/dashboard/LiveActivity";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Bell
} from "lucide-react";
import { getStatsOverview, mockJobCards, getLowStockItems } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const stats = getStatsOverview();
  const lowStockItems = getLowStockItems();
  const [activeView, setActiveView] = useState('overview');
  const [timeframe, setTimeframe] = useState('today');

  const handleMoveJob = (jobId, newStatus) => {
    // In real app, this would update the job status via API
    console.log(`Moving job ${jobId} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 space-y-8">
          {/* Modern Header with View Switcher */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center animate-pulse">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-modern bg-clip-text text-transparent">
                    Admin Command Center
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Real-time garage operations & analytics
                  </p>
                </div>
                <Badge className="bg-gradient-accent text-primary font-semibold animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Dashboard
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({lowStockItems.length})
              </Button>
              <Button className="bg-gradient-accent shadow-yellow hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                New Job Card
              </Button>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/30">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-accent data-[state=active]:text-primary"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="kanban"
                className="data-[state=active]:bg-gradient-modern data-[state=active]:text-secondary"
              >
                <Kanban className="h-4 w-4 mr-2" />
                Workflow
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-8">
              {/* Modern Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <RealtimeWidget
                  title="Active Jobs"
                  value={stats.totalActiveJobs}
                  icon={FileText}
                  change="+12% today"
                  trend="up"
                  color="primary"
                />
                <RealtimeWidget
                  title="Completed Today"
                  value={stats.completedJobs}
                  icon={Clock}
                  change="+8 jobs"
                  trend="up"
                  color="success"
                />
                <RealtimeWidget
                  title="Awaiting Parts"
                  value={stats.pendingParts}
                  icon={Package}
                  change="2 urgent"
                  trend="neutral"
                  color="warning"
                />
                <RealtimeWidget
                  title="Revenue Today"
                  value={`${stats.todayRevenue}`}
                  icon={DollarSign}
                  change="+15% vs yesterday"
                  trend="up"
                  color="secondary"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Activity and Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                  <LiveActivity />
                  
                  {/* Quick Actions - Modern */}
                  <Card className="border-0 shadow-medium bg-gradient-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-modern rounded-lg flex items-center justify-center">
                          <Zap className="h-4 w-4 text-secondary" />
                        </div>
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        size="touch" 
                        className="w-full justify-start border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                      >
                        <Plus className="mr-3 h-4 w-4" />
                        Create Job Card
                      </Button>
                      <Button 
                        variant="outline" 
                        size="touch" 
                        className="w-full justify-start border-secondary/20 hover:bg-secondary/5 hover:border-secondary/40 transition-all duration-300" 
                        onClick={() => navigate('/admin/inventory')}
                      >
                        <Package className="mr-3 h-4 w-4" />
                        Inventory Manager
                      </Button>
                      <Button 
                        variant="outline" 
                        size="touch" 
                        className="w-full justify-start border-success/20 hover:bg-success/5 hover:border-success/40 transition-all duration-300" 
                        onClick={() => navigate('/admin/reports')}
                      >
                        <BarChart3 className="mr-3 h-4 w-4" />
                        Analytics Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Critical Alerts Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Low Stock Alert */}
                  <Card className="border-0 shadow-medium bg-gradient-to-br from-warning/5 to-warning/10 border-l-4 border-l-warning">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center animate-pulse">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <span className="text-xl font-bold text-warning">Critical Stock Alert</span>
                          <p className="text-sm text-muted-foreground font-normal">Items below minimum threshold</p>
                        </div>
                        <Badge variant="outline" className="border-warning text-warning">
                          {lowStockItems.length} items
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {lowStockItems.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex justify-between items-center p-4 bg-background/80 rounded-xl border border-warning/20 hover:bg-background transition-all duration-300"
                          >
                            <div>
                              <p className="font-semibold text-sm text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-warning">{item.stock} units</p>
                              <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-warning to-warning/80 hover:shadow-yellow transition-all duration-300" 
                        onClick={() => navigate('/admin/inventory')}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Manage Stock Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Kanban Workflow Tab */}
            <TabsContent value="kanban" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Job Workflow Board</h2>
                  <p className="text-muted-foreground">Drag and drop jobs between stages</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/jobs')}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Detailed View
                </Button>
              </div>
              <KanbanBoard 
                jobs={mockJobCards} 
                onMoveJob={handleMoveJob}
                viewType="admin"
              />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Business Analytics</h2>
                  <p className="text-muted-foreground">Performance insights and trends</p>
                </div>
                <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value)}>
                  <TabsList className="bg-muted/30">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <AnalyticsPanel timeframe={timeframe} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
