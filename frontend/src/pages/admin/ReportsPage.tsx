import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp,
  DollarSign,
  FileText,
  Download,
  Calendar,
  Target,
  Activity,
  Users,
  Wrench,
  Clock,
  CheckCircle
} from "lucide-react";
import { getStatsOverview } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";

export default function ReportsPage() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('month');
  const stats = getStatsOverview();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$45,230",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "success"
    },
    {
      title: "Jobs Completed",
      value: "156",
      change: "+8.2%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "primary"
    },
    {
      title: "Avg. Service Time",
      value: "2.4h",
      change: "-5.1%",
      trend: "down" as const,
      icon: Clock,
      color: "warning"
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      trend: "up" as const,
      icon: Target,
      color: "success"
    },
    {
      title: "Active Technicians",
      value: "12",
      change: "+2",
      trend: "up" as const,
      icon: Users,
      color: "secondary"
    },
    {
      title: "Equipment Utilization",
      value: "87%",
      change: "+4.2%",
      trend: "up" as const,
      icon: Activity,
      color: "accent"
    }
  ];

  const reportTypes = [
    {
      title: "Financial Report",
      description: "Revenue, costs, and profitability analysis",
      icon: DollarSign,
      color: "success",
      period: "Monthly"
    },
    {
      title: "Operations Report",
      description: "Job completion, efficiency, and workflow metrics",
      icon: Wrench,
      color: "primary",
      period: "Weekly"
    },
    {
      title: "Customer Report",
      description: "Customer satisfaction and service quality",
      icon: Users,
      color: "secondary",
      period: "Monthly"
    },
    {
      title: "Performance Report",
      description: "Technician performance and productivity",
      icon: TrendingUp,
      color: "accent",
      period: "Monthly"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleLogout} />
        
        <main className="flex-1 p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center animate-pulse">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-modern bg-clip-text text-transparent">
                    Analytics & Reports
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Business insights and performance metrics
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
                <TabsList className="bg-muted/30">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpiData.map((kpi, index) => (
              <Card key={index} variant="stats" className="hover:shadow-glow transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      kpi.color === 'success' ? 'bg-success/20' :
                      kpi.color === 'primary' ? 'bg-primary/20' :
                      kpi.color === 'warning' ? 'bg-warning/20' :
                      kpi.color === 'secondary' ? 'bg-secondary/20' :
                      kpi.color === 'accent' ? 'bg-accent/20' :
                      'bg-muted/20'
                    }`}>
                      <kpi.icon className={`h-5 w-5 ${
                        kpi.color === 'success' ? 'text-success' :
                        kpi.color === 'primary' ? 'text-primary' :
                        kpi.color === 'warning' ? 'text-warning' :
                        kpi.color === 'secondary' ? 'text-secondary' :
                        kpi.color === 'accent' ? 'text-accent' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      kpi.trend === 'up' ? 'text-success border-success/30' : 
                      kpi.trend === 'down' ? 'text-destructive border-destructive/30' :
                      'text-muted-foreground border-muted/30'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        kpi.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      {kpi.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</p>
                    <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Analytics Panel */}
          <AnalyticsPanel timeframe={timeframe} />

          {/* Reports Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Available Reports</h2>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Reports
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportTypes.map((report, index) => (
                <Card key={index} variant="interactive" className="hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        report.color === 'success' ? 'bg-gradient-to-br from-success/20 to-success/10' :
                        report.color === 'primary' ? 'bg-gradient-to-br from-primary/20 to-primary/10' :
                        report.color === 'secondary' ? 'bg-gradient-to-br from-secondary/20 to-secondary/10' :
                        'bg-gradient-to-br from-accent/20 to-accent/10'
                      }`}>
                        <report.icon className={`h-6 w-6 ${
                          report.color === 'success' ? 'text-success' :
                          report.color === 'primary' ? 'text-primary' :
                          report.color === 'secondary' ? 'text-secondary' :
                          'text-accent'
                        }`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.period}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold">{report.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}