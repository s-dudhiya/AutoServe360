import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  Plus,
  AlertTriangle,
  DollarSign,
  Edit,
  Trash2,
  Loader2,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { PartFormModal } from "@/components/inventory/PartFormModal";
import { IssuePartModal } from "@/components/inventory/IssuePartModal";

export default function InventoryPage() {
  const navigate = useNavigate();
  
  const [inventory, setInventory] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isPartFormModalOpen, setIsPartFormModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [partsResponse, jobsResponse] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/parts/"),
        axios.get("http://127.0.0.1:8000/api/jobcards/")
      ]);
      
      setInventory(partsResponse.data);
      
      const activeJobCards = jobsResponse.data.filter(job => job.status !== 'done').map(job => ({
          ...job,
          id: job.id.toString(),
          customerName: job.customer?.name || 'N/A',
          vehicleNumber: job.vehicle?.registration_no || 'N/A',
      }));
      setActiveJobs(activeJobCards);

    } catch (err) {
      setError("Failed to fetch data. Please ensure the server is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNew = () => {
    setEditingPart(null);
    setIsPartFormModalOpen(true);
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setIsPartFormModalOpen(true);
  };

  const handleDelete = async (partId) => {
    if (window.confirm("Are you sure you want to delete this part? This action cannot be undone.")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/parts/${partId}/`);
        toast.success("Part deleted successfully!");
        fetchData();
      } catch (err) {
        toast.error("Failed to delete part. It may be in use on a job card.");
        console.error(err);
      }
    }
  };

  const handleSavePart = async (formData) => {
    try {
      if (editingPart) {
        await axios.put(`http://127.0.0.1:8000/api/parts/${editingPart.id}/`, formData);
        toast.success("Part updated successfully!");
      } else {
        await axios.post("http://127.0.0.1:8000/api/parts/", formData);
        toast.success("Part added successfully!");
      }
      setIsPartFormModalOpen(false);
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.name?.[0] || "Failed to save part.";
      toast.error(errorMessage);
      console.error(err.response?.data || err);
    }
  };

  const handleIssueSuccess = () => {
    setIsIssueModalOpen(false);
    fetchData();
  };

  // --- THIS IS THE FIX ---
  // The logic now directly checks if the stock quantity is less than or equal to 5.
  const lowStockItems = inventory.filter(item => item.stock_quantity <= 5);
  
  const totalValue = inventory.reduce((total, item) => total + (item.stock_quantity * parseFloat(item.unit_price)), 0);
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PartFormModal 
        isOpen={isPartFormModalOpen}
        onClose={() => setIsPartFormModalOpen(false)}
        onSave={handleSavePart}
        part={editingPart}
      />
      <IssuePartModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSuccess={handleIssueSuccess}
        inventory={inventory}
        activeJobs={activeJobs}
      />
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold py-1 text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
              Parts Inventory 
            </h1>
            <p className="text-gray-400">Track bike parts and service supplies inventory</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsIssueModalOpen(true)} variant="outline" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span>Issue Part to Job</span>
            </Button>
            <Button onClick={handleAddNew} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-lg flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Part</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border border-gray-700 shadow-lg"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Total Unique Parts</p><p className="text-2xl font-bold text-white">{inventory.length}</p></div><div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center"><Package className="h-6 w-6 text-yellow-400" /></div></div></CardContent></Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-400/30 shadow-lg"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Low Stock Parts</p><p className="text-2xl font-bold text-orange-400">{lowStockItems.length}</p></div><div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center"><AlertTriangle className="h-6 w-6 text-orange-400" /></div></div></CardContent></Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-400/30 shadow-lg"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-400">Total Stock Value</p><p className="text-2xl font-bold text-green-400">₹{totalValue.toFixed(2)}</p></div><div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center"><DollarSign className="h-6 w-6 text-green-400" /></div></div></CardContent></Card>
        </div>

        {/* Inventory Table */}
        <Card className="bg-gray-800 border border-gray-700 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-yellow-400">Inventory Items</CardTitle>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search parts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-gray-900 text-white border-gray-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4 text-sm font-semibold text-gray-400">Part Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-400 text-center">Stock</th>
                    <th className="p-4 text-sm font-semibold text-gray-400 text-right">Price</th>
                    <th className="p-4 text-sm font-semibold text-gray-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-yellow-400" /></td></tr>
                  ) : error ? (
                     <tr><td colSpan="4" className="text-center p-8 text-red-400">{error}</td></tr>
                  ) : (
                    filteredInventory.map(item => (
                      <tr key={item.id} className={`border-b border-gray-700 ${item.stock_quantity <= 5 ? 'bg-orange-500/10' : ''}`}>
                        <td className="p-4 font-medium text-white">{item.name}</td>
                        <td className="p-4 text-center">
                          <Badge className={item.stock_quantity <= 5 ? 'bg-orange-400/20 text-orange-400' : 'bg-green-400/20 text-green-400'}>
                            {item.stock_quantity}
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-mono text-white">₹{item.unit_price}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="text-blue-400 hover:bg-blue-400/10"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-400 hover:bg-red-400/10"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
