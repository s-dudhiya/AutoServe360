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
} from "lucide-react";
import {
  getStatsOverview,
  mockJobCards,
  getLowStockItems,
} from "@/utils/mockData";
import { useNavigate } from "react-router-dom";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";

// This component ONLY renders the content for the admin dashboard page.
// All layout (Sidebar, Navbar) is now handled by MainLayout.jsx.
export default function AdminDashboard() {
  const navigate = useNavigate();
  const stats = getStatsOverview();
  const lowStockItems = getLowStockItems();
  const [activeView, setActiveView] = useState("overview");
  const [timeframe, setTimeframe] = useState("today");

  const handleMoveJob = (jobId, newStatus) => {
    console.log(`Moving job ${jobId} to ${newStatus}`);
  };

  return (
    // The main wrapper div is gone. The component returns its content directly.
    <div className="space-y-8">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(250, 204, 21, 0.6);
          }
        }
        @keyframes slide-in {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>

      {/* Modern Header with Bike Garage Theme */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0 slide-in">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center pulse-glow">
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
            <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 font-semibold animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live Dashboard
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300"
          >
            <Bell className="h-4 w-4 mr-2" />
            Alerts ({lowStockItems.length})
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            New Service Job
          </Button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-800 border border-gray-700">
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
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-8 mt-6">
          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Active Service Jobs
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalActiveJobs}
                    </p>
                    <p className="text-green-400 text-sm">+12% today</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <Bike className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
             {/* Other stats cards... */}
          </div>
        </TabsContent>

        {/* Kanban Workflow Tab */}
        <TabsContent value="kanban" className="space-y-6 mt-6">
            <KanbanBoard 
              jobs={mockJobCards} 
              onMoveJob={handleMoveJob}
              viewType="admin"
            />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
            <AnalyticsPanel timeframe={timeframe} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
