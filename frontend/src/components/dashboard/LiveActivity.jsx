import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  User,
  Wrench,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export  function LiveActivity() {
  const [activities, setActivities] = useState([
    {
      id: "1",
      type: "job_completed",
      message: "Oil change completed for BMW X5",
      timestamp: "2 min ago",
      user: "Mike Johnson",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      id: "2",
      type: "customer_arrived",
      message: "Customer arrived for appointment",
      timestamp: "5 min ago",
      user: "Sarah Wilson",
      icon: User,
      color: "text-primary"
    },
    {
      id: "3",
      type: "job_started",
      message: "Engine diagnostic started",
      timestamp: "8 min ago",
      user: "Alex Rivera",
      icon: Wrench,
      color: "text-warning"
    },
    {
      id: "4",
      type: "part_ordered",
      message: "Brake pads ordered for Honda Civic",
      timestamp: "12 min ago",
      user: "System",
      icon: Package,
      color: "text-secondary"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity = {
        id: Date.now().toString(),
        type: "job_started",
        message: `New job activity - ${Math.random() > 0.5 ? 'Service' : 'Repair'} started`,
        timestamp: "Just now",
        user: "Live Update",
        icon: Activity,
        color: "text-primary"
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000); // New activity every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full border-0 shadow-medium bg-gradient-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <span>Live Activity</span>
          <Badge variant="outline" className="ml-auto animate-pulse">
            <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-primary/10 hover:bg-background/80 transition-all duration-300 ${
                  index === 0 ? 'animate-pulse' : ''
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-modern/10 ${activity.color === 'text-success' ? 'bg-success/10' : ''}`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {activity.message}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                
                {index === 0 && (
                  <div className="w-2 h-2 bg-secondary rounded-full animate-ping"></div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}