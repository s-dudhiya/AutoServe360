import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, Car, Wrench, Check, Clock } from "lucide-react";

// Helper to format the date nicely
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function JobDetailsModal({ isOpen, onClose, job, isLoading }) {
  // Map backend status values to user-friendly display text and colors
  const statusInfo = {
    queue: { text: "In Queue", color: "bg-blue-400/20 text-blue-400 border-blue-400/30" },
    service: { text: "Under Service", color: "bg-orange-400/20 text-orange-400 border-orange-400/30" },
    parts: { text: "Awaiting Parts", color: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30" },
    qc: { text: "Quality Check", color: "bg-purple-400/20 text-purple-400 border-purple-400/30" },
    done: { text: "Completed", color: "bg-green-400/20 text-green-400 border-green-400/30" },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400">
            Job Card Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed overview of service job #{job?.id}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
          </div>
        ) : job ? (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Details */}
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-400 flex items-center"><User className="mr-2 h-4 w-4" />Customer Info</h4>
                <p className="text-sm"><strong>Name:</strong> {job.customer.name}</p>
                <p className="text-sm"><strong>Phone:</strong> {job.customer.phone}</p>
                <p className="text-sm"><strong>Email:</strong> {job.customer.email || 'N/A'}</p>
              </div>
              {/* Vehicle Details */}
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-400 flex items-center"><Car className="mr-2 h-4 w-4" />Vehicle Info</h4>
                <p className="text-sm"><strong>Reg. No:</strong> {job.vehicle.registration_no}</p>
                <p className="text-sm"><strong>Make:</strong> {job.vehicle.make}</p>
                <p className="text-sm"><strong>Model:</strong> {job.vehicle.model}</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4 space-y-2">
                <h4 className="font-semibold text-yellow-400 flex items-center"><Wrench className="mr-2 h-4 w-4" />Job Details</h4>
                <div className="flex items-center justify-between">
                    <p className="text-sm"><strong>Status:</strong></p>
                    <Badge className={statusInfo[job.status]?.color || ''}>{statusInfo[job.status]?.text || job.status}</Badge>
                </div>
                <p className="text-sm"><strong>Assigned To:</strong> {job.assigned_mechanic || 'Not Assigned'}</p>
                <p className="text-sm"><strong>Created On:</strong> {formatDate(job.created_at)}</p>
            </div>
             {/* Service Tasks */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
                <h4 className="font-semibold text-yellow-400 flex items-center"><Check className="mr-2 h-4 w-4" />Service Tasks</h4>
                <ul className="space-y-2">
                    {job.tasks && job.tasks.length > 0 ? (
                        job.tasks.map(task => (
                            <li key={task.id} className="flex items-center text-sm bg-gray-900/50 p-2 rounded-md">
                                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                {task.description}
                            </li>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No specific tasks listed for this job.</p>
                    )}
                </ul>
            </div>
          </div>
        ) : (
            <p className="text-center text-gray-400">Could not load job details.</p>
        )}
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
