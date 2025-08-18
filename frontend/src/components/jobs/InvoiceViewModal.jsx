import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bike } from "lucide-react";

// Helper to format dates and times
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

export function InvoiceViewModal({ isOpen, onClose, job }) {
  const invoice = job?.invoice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-lg top-[5rem] translate-y-0">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mx-auto mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bike className="h-7 w-7 text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-yellow-400">AutoServe 360</h1>
          </div>
          <DialogTitle className="text-3xl font-bold text-white">Tax Invoice</DialogTitle>
          <DialogDescription className="text-gray-400">Invoice #{invoice?.id} | Job #{job?.id}</DialogDescription>
        </DialogHeader>
        
        {invoice ? (
            <div className="max-h-[calc(100vh-15rem)] overflow-y-auto space-y-6 py-4 px-2">
                {/* Customer & Vehicle Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-yellow-400 mb-1">Billed To:</h3>
                        <p>{job.customer?.name}</p>
                        <p>{job.customer?.phone}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <h3 className="font-semibold text-yellow-400 mb-1">Invoice Date:</h3>
                        <p>{formatDateTime(invoice.created_at)}</p>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="border-t border-b border-gray-700 py-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left pb-2 font-semibold">Item Description</th>
                                <th className="text-center pb-2 font-semibold">Qty</th>
                                <th className="text-right pb-2 font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {job.parts_used?.map(usage => (
                                <tr key={usage.id}>
                                    <td className="py-2">{usage.part?.name || 'Deleted Part'}</td>
                                    <td className="py-2 text-center">{usage.quantity_used}</td>
                                    <td className="py-2 text-right font-mono">₹{usage.price_at_time_of_use}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="py-2">Labor Charge</td>
                                <td className="py-2 text-center">1</td>
                                <td className="py-2 text-right font-mono">₹{invoice.labor_charge}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><p className="text-gray-400">Subtotal:</p><p className="font-mono">₹{(parseFloat(invoice.parts_total) + parseFloat(invoice.labor_charge)).toFixed(2)}</p></div>
                    <div className="flex justify-between"><p className="text-gray-400">GST (12%):</p><p className="font-mono">₹{invoice.tax}</p></div>
                    <div className="flex justify-between"><p className="text-gray-400">Discount:</p><p className="font-mono text-green-400">- ₹{invoice.discount}</p></div>
                    <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-bold text-lg text-yellow-400">
                        <p>Grand Total:</p>
                        <p className="font-mono">₹{invoice.total_amount}</p>
                    </div>
                </div>
            </div>
        ) : (
            <p className="text-center text-gray-400 py-8">No invoice details available.</p>
        )}

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-gray-600 text-gray-900 hover:bg-gray-700">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
