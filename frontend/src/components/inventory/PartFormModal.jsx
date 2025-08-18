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
import { Loader2 } from "lucide-react";

export function PartFormModal({ isOpen, onClose, onSave, part }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock_quantity: 0,
    min_stock_level: 5,
    unit_price: "",
    supplier: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When the 'part' prop changes (i.e., when editing), update the form data
  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name || "",
        category: part.category || "Uncategorized",
        stock_quantity: part.stock_quantity || 0,
        min_stock_level: part.min_stock_level || 5,
        unit_price: part.unit_price || "",
        supplier: part.supplier || "",
      });
    } else {
      // Reset form for adding a new part
      setFormData({
        name: "",
        category: "",
        stock_quantity: 0,
        min_stock_level: 5,
        unit_price: "",
        supplier: "",
      });
    }
  }, [part, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400">
            {part ? "Edit Part" : "Add New Part"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {part ? "Update the details for this part." : "Fill in the details for the new part."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Part Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-gray-900 border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" value={formData.category} onChange={handleChange} className="bg-gray-900 border-gray-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input id="stock_quantity" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} required className="bg-gray-900 border-gray-700" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="min_stock_level">Min. Stock Level</Label>
              <Input id="min_stock_level" name="min_stock_level" type="number" value={formData.min_stock_level} onChange={handleChange} required className="bg-gray-900 border-gray-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price (₹)</Label>
              <Input id="unit_price" name="unit_price" type="number" step="0.01" value={formData.unit_price} onChange={handleChange} required className="bg-gray-900 border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier (Optional)</Label>
              <Input id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} className="bg-gray-900 border-gray-700" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-900 hover:bg-gray-700">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
