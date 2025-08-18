import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function IssuePartModal({ isOpen, onClose, onSuccess, inventory, activeJobs }) {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobId || !selectedPartId || quantity <= 0) {
      setError("Please select a job, a part, and enter a valid quantity.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        part_id: parseInt(selectedPartId),
        quantity_used: parseInt(quantity),
      };
      await axios.post(`http://127.0.0.1:8000/api/jobcards/${selectedJobId}/issue-part/`, payload);
      toast.success("Part issued successfully!");
      onSuccess(); // This will refresh the inventory list and close the modal
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to issue part.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedJobId("");
      setSelectedPartId("");
      setQuantity(1);
      setError("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* --- FIX: Added a style block to customize the scrollbar --- */}
      <style jsx global>{`
        [data-radix-select-viewport] {
          scrollbar-width: thin;
          scrollbar-color: #facc15 #1f2937;
        }
        [data-radix-select-viewport]::-webkit-scrollbar {
          width: 8px;
        }
        [data-radix-select-viewport]::-webkit-scrollbar-track {
          background: #1f2937;
        }
        [data-radix-select-viewport]::-webkit-scrollbar-thumb {
          background-color: #facc15;
          border-radius: 10px;
          border: 2px solid #1f2937;
        }
        /* Hide the default Radix UI scroll arrows */
        [data-radix-select-scroll-button] {
          display: none;
        }
      `}</style>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400">
            Issue Part to Job
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a job and a part to update the inventory and job records.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="jobcard">Select Job Card</Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger id="jobcard" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Choose an active job..." />
              </SelectTrigger>
              {/* --- FIX: Added props to control position and scrolling --- */}
              <SelectContent position="popper" side="bottom" className="max-h-[12rem] overflow-y-auto">
                {activeJobs.map(job => (
                  <SelectItem key={job.id} value={job.id.toString()}>
                    #{job.id} - {job.customerName} ({job.vehicleNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="part">Select Part</Label>
            <Select value={selectedPartId} onValueChange={setSelectedPartId}>
              <SelectTrigger id="part" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Choose a part from inventory..." />
              </SelectTrigger>
               {/* --- FIX: Added props to control position and scrolling --- */}
              <SelectContent position="popper" side="bottom" className="max-h-[12rem] overflow-y-auto">
                {inventory.map(part => (
                  <SelectItem key={part.id} value={part.id.toString()}>
                    {part.name} (In Stock: {part.stock_quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Used</Label>
            <Input 
              id="quantity" 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              min="1"
              className="bg-gray-900 border-gray-700" 
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-900 hover:bg-gray-700">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Issue Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
