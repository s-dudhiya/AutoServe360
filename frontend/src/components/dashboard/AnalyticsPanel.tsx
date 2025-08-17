import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Users, 
  Wrench,
  BarChart3,
  Calendar,
  Target,
  Zap
} from "lucide-react";

interface AnalyticsPanelProps {
  timeframe: 'today' | 'week' | 'month';
}

export function AnalyticsPanel({ timeframe }: AnalyticsPanelProps) {
  const metrics = {
    today: {
      revenue: { value: '$2,847', change: '+12%', trend: 'up' },
      jobsCompleted: { value: '23', change: '+8', trend: 'up' },
      avgTime: { value: '2.4h', change: '-15min', trend: 'up' },
      customerSatisfaction: { value: '98%', change: '+2%', trend: 'up' },
      efficiency: { value: '89%', change: '+5%', trend: 'up' },
      utilization: { value: '94%', change: '+3%', trend: 'up' }
    },
    week: {
      revenue: { value: '$19,240', change: '+18%', trend: 'up' },
      jobsCompleted: { value: '156', change: '+12', trend: 'up' },
      avgTime: { value: '2.1h', change: '-25min', trend: 'up' },
      customerSatisfaction: { value: '96%', change: '+1%', trend: 'up' },
      efficiency: { value: '91%', change: '+7%', trend: 'up' },
      utilization: { value: '88%', change: '+2%', trend: 'up' }
    },
    month: {
      revenue: { value: '$84,560', change: '+23%', trend: 'up' },
      jobsCompleted: { value: '687', change: '+45', trend: 'up' },
      avgTime: { value: '2.0h', change: '-35min', trend: 'up' },
      customerSatisfaction: { value: '97%', change: '+3%', trend: 'up' },
      efficiency: { value: '93%', change: '+8%', trend: 'up' },
      utilization: { value: '91%', change: '+4%', trend: 'up' }
    }
  };

  const currentMetrics = metrics[timeframe];

  const analyticCards = [
    {
      title: 'Total Revenue',
      value: currentMetrics.revenue.value,
      change: currentMetrics.revenue.change,
      trend: currentMetrics.revenue.trend,
      icon: DollarSign,
      gradient: 'bg-gradient-primary',
      description: `Revenue for ${timeframe}`
    },
    {
      title: 'Jobs Completed',
      value: currentMetrics.jobsCompleted.value,
      change: currentMetrics.jobsCompleted.change,
      trend: currentMetrics.jobsCompleted.trend,
      icon: Wrench,
      gradient: 'bg-gradient-accent',
      description: 'Successfully completed'
    },
    {
      title: 'Avg Service Time',
      value: currentMetrics.avgTime.value,
      change: currentMetrics.avgTime.change,
      trend: currentMetrics.avgTime.trend,
      icon: Clock,
      gradient: 'bg-gradient-modern',
      description: 'Time per job'
    },
    {
      title: 'Customer Satisfaction',
      value: currentMetrics.customerSatisfaction.value,
      change: currentMetrics.customerSatisfaction.change,
      trend: currentMetrics.customerSatisfaction.trend,
      icon: Users,
      gradient: 'bg-gradient-success',
      description: 'Customer rating'
    },
    {
      title: 'Workshop Efficiency',
      value: currentMetrics.efficiency.value,
      change: currentMetrics.efficiency.change,
      trend: currentMetrics.efficiency.trend,
      icon: Target,
      gradient: 'bg-gradient-warning',
      description: 'Performance metric'
    },
    {
      title: 'Bay Utilization',
      value: currentMetrics.utilization.value,
      change: currentMetrics.utilization.change,
      trend: currentMetrics.utilization.trend,
      icon: Zap,
      gradient: 'bg-gradient-secondary',
      description: 'Workspace usage'
    }
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticCards.map((card, index) => {
          const TrendIcon = getTrendIcon(card.trend);
          const CardIcon = card.icon;
          
          return (
            <Card key={card.title} className="border-0 shadow-glow bg-gradient-card relative overflow-hidden group hover:shadow-strong transition-all duration-300">
              <div className={`absolute inset-0 ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${card.gradient} flex items-center justify-center shadow-medium`}>
                    <CardIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getTrendColor(card.trend)} border-current/20 bg-current/10`}
                  >
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {card.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-2">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-foreground">{card.value}</h3>
                  <p className="text-sm font-semibold text-muted-foreground">{card.title}</p>
                  <p className="text-xs text-muted-foreground/70">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-glow bg-gradient-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold">Revenue Trends</span>
                <p className="text-sm text-muted-foreground font-normal">Daily revenue breakdown</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 mx-auto opacity-30" />
                <p className="text-sm">Revenue Chart</p>
                <p className="text-xs opacity-70">Interactive chart would display here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-glow bg-gradient-card">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold">Service Efficiency</span>
                <p className="text-sm text-muted-foreground font-normal">Average completion times</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { service: 'Oil Change', time: '45 min', efficiency: '95%', color: 'bg-success' },
                { service: 'Brake Service', time: '2.5 hours', efficiency: '88%', color: 'bg-warning' },
                { service: 'Engine Diagnostic', time: '4 hours', efficiency: '92%', color: 'bg-primary' },
                { service: 'Annual Service', time: '6 hours', efficiency: '90%', color: 'bg-secondary' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-foreground">{item.service}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{item.time}</p>
                    <p className="text-xs text-success">{item.efficiency}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}