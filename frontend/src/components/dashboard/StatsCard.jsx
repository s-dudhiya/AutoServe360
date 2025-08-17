import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export  function StatsCard({ title, value, icon: Icon, trend, variant = 'default' }) {
  const variantStyles = {
    default: "border-border",
    success: "border-success/20 bg-success/5",
    warning: "border-warning/20 bg-warning/5",
    primary: "border-primary/20 bg-primary/5"
  };

  const iconStyles = {
    default: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning",
    primary: "text-primary"
  };

  return (
    <Card variant="stats" className={cn("p-6", variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-2 flex items-center",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span className="mr-1">
                {trend.isPositive ? "↗" : "↘"}
              </span>
              {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          variant === 'success' && "bg-success/10",
          variant === 'warning' && "bg-warning/10",
          variant === 'primary' && "bg-primary/10",
          variant === 'default' && "bg-muted"
        )}>
          <Icon className={cn("h-6 w-6", iconStyles[variant])} />
        </div>
      </div>
    </Card>
  );
}