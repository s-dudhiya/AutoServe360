import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function InvoiceFormModal({ isOpen, onClose, onSuccess, job }) {
  // State for form inputs and submission status
  const [laborCharge, setLaborCharge] = useState("533.00");
  const [discount, setDiscount] = useState("0.00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // State for calculated values
  const [partsTotal, setPartsTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // --- THIS IS THE DEFINITIVE FIX ---
  // This useEffect hook programmatically adds and removes the required CSS
  // to make the dialog overlay transparent, which is a reliable method in any React project.
  useEffect(() => {
    // A unique ID for the style tag to prevent duplicates
    const styleTagId = 'dialog-overlay-style-fix';

    if (isOpen) {
      // If the style tag doesn't already exist, create and append it
      if (!document.getElementById(styleTagId)) {
        const style = document.createElement('style');
        style.id = styleTagId;
        style.innerHTML = `
          [data-radix-dialog-overlay] {
            background-color: transparent !important;
            backdrop-filter: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
    // The cleanup function for when the component unmounts is not strictly necessary
    // for this specific problem, but it's good practice. The overlay is only present
    // when a dialog is open anyway.
  }, [isOpen]);


  // This effect recalculates all totals whenever the inputs change or the modal opens
  useEffect(() => {
    if (isOpen) {
      setError("");
    }

    const calculatedPartsTotal = job?.parts_used?.reduce((acc, usage) => {
      return acc + (parseFloat(usage.price_at_time_of_use) * usage.quantity_used);
    }, 0) || 0;
    setPartsTotal(calculatedPartsTotal);

    const currentLabor = parseFloat(laborCharge) || 0;
    const currentDiscount = parseFloat(discount) || 0;

    const currentSubtotal = calculatedPartsTotal + currentLabor;
    const currentGst = currentSubtotal * 0.12;
    const currentGrandTotal = currentSubtotal + currentGst - currentDiscount;

    setSubtotal(currentSubtotal);
    setGstAmount(currentGst);
    setGrandTotal(currentGrandTotal);

  }, [job, laborCharge, discount, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        labor_charge: laborCharge,
        discount: discount,
      };
      await axios.post(`http://127.0.0.1:8000/api/jobcards/${job.id}/create-invoice/`, payload);
      toast.success("Invoice generated successfully!");
      onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to generate invoice.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* The non-working <style jsx> block has been removed */}
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400">Generate Invoice for Job #{job?.id}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Confirm the charges to create the final bill for this service.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Parts Total</Label>
            <Input value={`₹${partsTotal.toFixed(2)}`} readOnly className="bg-gray-700 border-gray-600 font-mono" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="laborCharge">Labor Charge (₹)</Label>
            <Input id="laborCharge" type="number" step="0.01" value={laborCharge} onChange={(e) => setLaborCharge(e.target.value)} className="bg-gray-900 border-gray-700 font-mono" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount (₹)</Label>
            <Input id="discount" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} className="bg-gray-900 border-gray-700 font-mono" />
          </div>

          <div className="border-t border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-400"><p>Subtotal (Parts + Labor):</p><p className="font-mono">₹{subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between text-sm text-gray-400"><p>GST (12%):</p><p className="font-mono">₹{gstAmount.toFixed(2)}</p></div>
            <div className="flex justify-between text-lg font-bold text-yellow-400"><p>Grand Total:</p><p className="font-mono">₹{grandTotal.toFixed(2)}</p></div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-900 hover:bg-gray-700">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600 text-white">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
