import { useState, useEffect } from "react";
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
import { Loader2, User, Car, Wrench, Check, Clock, FileText, DollarSign, Package, Download, Eye } from "lucide-react";
import { InvoiceFormModal } from "./InvoiceFormModal";
import { InvoiceViewModal } from "./InvoiceViewModal"; // Import the new view modal
import axios from "axios";
import { toast } from "sonner";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    return date.toLocaleString("en-IN", {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  } catch (e) {
    return "Invalid Date";
  }
};

export function JobDetailsModal({ isOpen, onClose, jobId, onRefresh }) {
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvoiceFormModalOpen, setIsInvoiceFormModalOpen] = useState(false);
  const [isInvoiceViewModalOpen, setIsInvoiceViewModalOpen] = useState(false); // State for the new view modal

  const fetchJobDetails = async () => {
    if (isOpen && jobId) {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/jobcards/${jobId}/`);
        setJob(response.data);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  useEffect(() => {
    fetchJobDetails();
  }, [isOpen, jobId]);

  const handleInvoiceSuccess = () => {
    setIsInvoiceFormModalOpen(false);
    fetchJobDetails(); 
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDownloadPdf = async () => {
    if (!job?.id) return;
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/jobcards/${job.id}/invoice-pdf/`, {
            responseType: 'blob',
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${job.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Invoice downloaded!");

    } catch (err) {
        toast.error("Failed to download invoice PDF.");
        console.error("PDF Download Error:", err);
    }
  };

  const statusInfo = {
    queue: { text: "In Queue", color: "bg-blue-400/20 text-blue-400" },
    service: { text: "Under Service", color: "bg-orange-400/20 text-orange-400" },
    parts: { text: "Awaiting Parts", color: "bg-yellow-400/20 text-yellow-400" },
    qc: { text: "Quality Check", color: "bg-purple-400/20 text-purple-400" },
    done: { text: "Completed", color: "bg-green-400/20 text-green-400" },
  };

  return (
    <>
      <InvoiceFormModal
        isOpen={isInvoiceFormModalOpen}
        onClose={() => setIsInvoiceFormModalOpen(false)}
        onSuccess={handleInvoiceSuccess}
        job={job}
      />
      {/* Add the new Invoice View Modal */}
      <InvoiceViewModal
        isOpen={isInvoiceViewModalOpen}
        onClose={() => setIsInvoiceViewModalOpen(false)}
        job={job}
      />
      <style jsx global>{`
        .job-details-modal-content { scrollbar-width: thin; scrollbar-color: #facc15 #1f2937; }
        .job-details-modal-content::-webkit-scrollbar { width: 8px; }
        .job-details-modal-content::-webkit-scrollbar-track { background: #1f2937; }
        .job-details-modal-content::-webkit-scrollbar-thumb { background-color: #facc15; border-radius: 10px; border: 2px solid #1f2937; }
        [data-radix-dialog-overlay] { background-color: transparent !important; backdrop-filter: none !important; }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-lg top-[5rem] translate-y-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-400">Job Card Details</DialogTitle>
            <DialogDescription className="text-gray-400">Detailed overview of service job #{job?.id}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-4 job-details-modal-content">
            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 text-yellow-400 animate-spin" /></div>
            ) : job ? (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><h4 className="font-semibold text-yellow-400 flex items-center"><User className="mr-2 h-4 w-4" />Customer Info</h4><p className="text-sm"><strong>Name:</strong> {job.customer?.name || 'N/A'}</p><p className="text-sm"><strong>Phone:</strong> {job.customer?.phone || 'N/A'}</p></div>
                  <div className="space-y-2"><h4 className="font-semibold text-yellow-400 flex items-center"><Car className="mr-2 h-4 w-4" />Vehicle Info</h4><p className="text-sm"><strong>Reg. No:</strong> {job.vehicle?.registration_no || 'N/A'}</p><p className="text-sm"><strong>Make:</strong> {job.vehicle?.make || 'N/A'}</p><p className="text-sm"><strong>Model:</strong> {job.vehicle?.model || 'N/A'}</p></div>
                </div>
                <div className="border-t border-gray-700 pt-4 space-y-2"><h4 className="font-semibold text-yellow-400 flex items-center"><Wrench className="mr-2 h-4 w-4" />Job Details</h4><div className="flex items-center justify-between"><p className="text-sm"><strong>Status:</strong></p><Badge className={statusInfo[job.status]?.color || ''}>{statusInfo[job.status]?.text || job.status}</Badge></div><p className="text-sm"><strong>Assigned To:</strong> {job.assigned_mechanic || 'Not Assigned'}</p><p className="text-sm"><strong>Created On:</strong> {formatDateTime(job.created_at)}</p></div>
                <div className="border-t border-gray-700 pt-4 space-y-2"><h4 className="font-semibold text-yellow-400 flex items-center"><Check className="mr-2 h-4 w-4" />Service Tasks</h4><ul className="space-y-2 max-h-32 overflow-y-auto">{job.tasks && job.tasks.length > 0 ? (job.tasks.map(task => (<li key={task.id} className="flex items-center text-sm bg-gray-900/50 p-2 rounded-md"><Clock className="mr-2 h-4 w-4 text-gray-400" />{task.description}</li>))) : (<p className="text-sm text-gray-400">No specific tasks listed.</p>)}</ul></div>
                <div className="border-t border-gray-700 pt-4 space-y-2"><h4 className="font-semibold text-yellow-400 flex items-center"><Package className="mr-2 h-4 w-4" />Parts Used</h4><ul className="space-y-2 max-h-32 overflow-y-auto">{job.parts_used && job.parts_used.length > 0 ? (job.parts_used.map(usage => (<li key={usage.id} className="flex justify-between text-sm bg-gray-900/50 p-2 rounded-md"><span>{usage.quantity_used} x {usage.part?.name || 'Deleted Part'}</span><span className="font-mono">₹{usage.price_at_time_of_use}</span></li>))) : (<p className="text-sm text-gray-400">No parts issued for this job.</p>)}</ul></div>
                
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <h4 className="font-semibold text-yellow-400 flex items-center"><DollarSign className="mr-2 h-4 w-4" />Billing</h4>
                  {job.invoice ? (
                    <div className="space-y-2">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><p className="text-gray-400">Invoice Generated:</p><span className="text-white font-medium">{formatDateTime(job.invoice.created_at)}</span></div>
                        <div className="flex justify-between"><p className="text-gray-400">Grand Total:</p><span className="text-green-400 font-bold font-mono">₹{job.invoice.total_amount}</span></div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => setIsInvoiceViewModalOpen(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white"><Eye className="mr-2 h-4 w-4" />View Invoice</Button>
                        <Button onClick={handleDownloadPdf} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Button onClick={() => setIsInvoiceFormModalOpen(true)} className="w-full bg-green-500 hover:bg-green-600 text-white">Generate Invoice</Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (<p className="text-center text-gray-400">Could not load job details.</p>)}
          </div>
          <DialogFooter><Button onClick={onClose} variant="outline" className="border-gray-600 hover:bg-gray-700">Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
