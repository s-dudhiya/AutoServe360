import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, TrendingUp, Users } from "lucide-react";

interface RealtimeWidgetProps {
  title: string;
  icon: React.ComponentType<any>;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "secondary" | "success" | "warning";
}

export function RealtimeWidget({ 
  title, 
  icon: Icon, 
  value, 
  change, 
  trend = "neutral",
  color = "primary" 
}: RealtimeWidgetProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const colorClasses = {
    primary: "bg-gradient-primary text-primary-foreground",
    secondary: "bg-gradient-accent text-primary",
    success: "bg-gradient-to-r from-success to-success/80 text-success-foreground",
    warning: "bg-gradient-to-r from-warning to-warning/80 text-warning-foreground"
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive", 
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-medium hover:shadow-glow transition-all duration-500 group">
      <div className="absolute inset-0 bg-gradient-modern opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`p-2 rounded-xl ${colorClasses[color]} ${isAnimating ? 'scale-110' : ''} transition-transform duration-300`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${isAnimating ? 'scale-105' : ''} transition-transform duration-300`}>
            {value}
          </div>
          {change && (
            <div className="flex items-center space-x-2">
              <TrendingUp className={`h-3 w-3 ${trendColors[trend]} ${trend === "down" ? "rotate-180" : ""}`} />
              <span className={`text-xs font-medium ${trendColors[trend]}`}>
                {change}
              </span>
              <Badge variant="outline" className="text-xs px-2 py-0">
                Live
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Pulse Animation */}
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
      </div>
    </Card>
  );
}