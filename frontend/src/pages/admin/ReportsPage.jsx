import { useState } from "react";
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
  CheckCircle,
} from "lucide-react";
import { getStatsOverview } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";

// This component is now clean. It ONLY renders the content for the Reports page.
// All layout is handled by MainLayout.jsx.
export default function ReportsPage() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("month");
  const stats = getStatsOverview();

  const kpiData = [
    {
      title: "Total Revenue",
      value: "₹45,230",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "success",
    },
    {
      title: "Jobs Completed",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: CheckCircle,
      color: "primary",
    },
    {
      title: "Avg. Service Time",
      value: "2.4h",
      change: "-5.1%",
      trend: "down",
      icon: Clock,
      color: "warning",
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "+0.3",
      trend: "up",
      icon: Target,
      color: "success",
    },
    {
      title: "Active Technicians",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "secondary",
    },
    {
      title: "Equipment Utilization",
      value: "87%",
      change: "+4.2%",
      trend: "up",
      icon: Activity,
      color: "accent",
    },
  ];

  const reportTypes = [
    {
      title: "Financial Report",
      description: "Revenue, costs, and profitability analysis",
      icon: DollarSign,
      color: "success",
      period: "Monthly",
    },
    {
      title: "Operations Report",
      description: "Job completion, efficiency, and workflow metrics",
      icon: Wrench,
      color: "primary",
      period: "Weekly",
    },
    {
      title: "Customer Report",
      description: "Customer satisfaction and service quality",
      icon: Users,
      color: "secondary",
      period: "Monthly",
    },
    {
      title: "Performance Report",
      description: "Technician performance and productivity",
      icon: TrendingUp,
      color: "accent",
      period: "Monthly",
    },
  ];

  return (
    // The component now returns a single div with its content.
    // All Sidebar, Navbar, and layout state has been removed.
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
              Analytics & Reports
            </h1>
            <p className="text-gray-400 text-lg">
              Business insights and garage performance
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger
                value="today"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="week"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900"
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900"
              >
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <Card
            key={index}
            className="bg-gray-800 border border-gray-700 shadow-lg hover:border-yellow-400/50 transition-colors duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    kpi.color === "success"
                      ? "bg-green-400/20"
                      : kpi.color === "primary"
                      ? "bg-yellow-400/20"
                      : kpi.color === "warning"
                      ? "bg-orange-400/20"
                      : kpi.color === "secondary"
                      ? "bg-blue-400/20"
                      : kpi.color === "accent"
                      ? "bg-purple-400/20"
                      : "bg-gray-700/20"
                  }`}
                >
                  <kpi.icon
                    className={`h-5 w-5 ${
                      kpi.color === "success"
                        ? "text-green-400"
                        : kpi.color === "primary"
                        ? "text-yellow-400"
                        : kpi.color === "warning"
                        ? "text-orange-400"
                        : kpi.color === "secondary"
                        ? "text-blue-400"
                        : kpi.color === "accent"
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    kpi.trend === "up"
                      ? "text-green-400 border-green-400/25"
                      : kpi.trend === "down"
                      ? "text-red-400 border-red-400/25"
                      : "text-gray-400 border-gray-400/25"
                  }`}
                >
                  <TrendingUp
                    className={`h-3 w-3 mr-1 ${
                      kpi.trend === "down" ? "rotate-180" : ""
                    }`}
                  />
                  {kpi.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">
                  {kpi.title}
                </p>
                <p className="text-xl font-bold text-white">{kpi.value}</p>
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
          <h2 className="text-2xl font-bold text-yellow-400">
            Available Reports
          </h2>
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Reports
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report, index) => (
            <Card
              key={index}
              className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-yellow-400/10 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      report.color === "success"
                        ? "bg-green-400/20"
                        : report.color === "primary"
                        ? "bg-yellow-400/20"
                        : report.color === "secondary"
                        ? "bg-blue-400/20"
                        : "bg-purple-400/20"
                    }`}
                  >
                    <report.icon
                      className={`h-6 w-6 ${
                        report.color === "success"
                          ? "text-green-400"
                          : report.color === "primary"
                          ? "text-yellow-400"
                          : report.color === "secondary"
                          ? "text-blue-400"
                          : "text-purple-400"
                      }`}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-yellow-400 text-yellow-400"
                  >
                    {report.period}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-white">
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">{report.description}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
