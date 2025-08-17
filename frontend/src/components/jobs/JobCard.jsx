import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Car, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
  'In Queue': 'bg-muted text-muted-foreground',
  'Under Service': 'bg-primary/10 text-primary border-primary/20',
  'Awaiting Parts': 'bg-warning/10 text-warning border-warning/20',
  'QC': 'bg-secondary/10 text-secondary border-secondary/20',
  'Completed': 'bg-success/10 text-success border-success/20'
};

const priorityColors = {
  'Low': 'bg-muted text-muted-foreground',
  'Medium': 'bg-warning/10 text-warning border-warning/20',
  'High': 'bg-destructive/10 text-destructive border-destructive/20'
};

export function JobCard({ job, onViewDetails, showMechanic = true }) {
  const createdDate = new Date(job.createdAt).toLocaleDateString();
  const estimatedDate = new Date(job.estimatedCompletion).toLocaleDateString();

  return (
    <Card variant="interactive" className="hover:shadow-medium transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{job.id}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={cn("border", priorityColors[job.priority])}>
              {job.priority}
            </Badge>
            <Badge variant="outline" className={cn("border", statusColors[job.status])}>
              {job.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{job.customerName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{job.customerPhone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Car className="h-4 w-4" />
              <span>{job.vehicleBrand} {job.vehicleModel} ({job.vehicleNumber})</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created: {createdDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Due: {estimatedDate}</span>
            </div>
            {showMechanic && job.assignedMechanic && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Mechanic: {job.assignedMechanic}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-1">{job.serviceType}</h4>
          <p className="text-sm text-muted-foreground">{job.description}</p>
        </div>

        {onViewDetails && (
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job.id)}
            >
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}