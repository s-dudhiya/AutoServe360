import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Car } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to format the date
const formatDate = (dateString) => {
  if (!dateString) return "Invalid Date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function JobCard({ job, onViewDetails }) {
  const statusColors = {
    'In Queue': 'bg-blue-400/20 text-blue-400 border-blue-400/30',
    'Under Service': 'bg-orange-400/20 text-orange-400 border-orange-400/30',
    'Awaiting Parts': 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
    'QC': 'bg-purple-400/20 text-purple-400 border-purple-400/30',
    'Completed': 'bg-green-400/20 text-green-400 border-green-400/30'
  };

  return (
    <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">Job #{job.id}</CardTitle>
          <Badge className={cn("border", statusColors[job.status])}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{job.customerName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Car className="h-4 w-4" />
            <span>{job.vehicleBrand} {job.vehicleModel} ({job.vehicleNumber})</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            {/* Correctly formatted date */}
            <span>Created: {formatDate(job.created_at)}</span>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-1 text-white">{job.serviceType || 'General Service'}</h4>
        </div>

        {onViewDetails && (
          <div className="flex justify-end pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(job.id)}
              className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
            >
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
