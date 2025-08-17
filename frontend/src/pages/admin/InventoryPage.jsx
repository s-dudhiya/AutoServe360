import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package, 
  Plus,
  AlertTriangle,
  TrendingDown,
  DollarSign
} from "lucide-react";
import { mockInventory, getLowStockItems } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const lowStockItems = getLowStockItems();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const filteredInventory = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = mockInventory.reduce((total, item) => total + (item.stock * item.price), 0);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleLogout} />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground">Track spare parts and supplies inventory</p>
            </div>
            <Button variant="hero" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Item</span>
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="stats">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold text-foreground">{mockInventory.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card variant="stats" className="border-warning/20 bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                    <p className="text-2xl font-bold text-warning">{lowStockItems.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card variant="stats" className="border-success/20 bg-success/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-success">${totalValue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Low Stock Alert */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Inventory Items</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items, categories, or suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-3">
                      {filteredInventory.map((item) => (
                        <Card key={item.id} variant="interactive" className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-foreground">{item.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                {item.stock <= item.minStock && (
                                  <Badge variant="outline" className="text-xs border-warning text-warning">
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    Low Stock
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Supplier: {item.supplier}
                              </p>
                            </div>
                            
                            <div className="text-right space-y-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Stock</p>
                                  <p className={`font-semibold ${item.stock <= item.minStock ? 'text-warning' : 'text-foreground'}`}>
                                    {item.stock}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Min</p>
                                  <p className="font-semibold text-foreground">{item.minStock}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Price</p>
                                  <p className="font-semibold text-foreground">${item.price}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Alert Sidebar */}
            <div>
              <Card variant="gradient" className="border-warning/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-warning">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Low Stock Alert</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="p-3 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-warning">{item.stock} left</p>
                          <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {lowStockItems.length === 0 && (
                    <div className="text-center py-6">
                      <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">All items are well stocked!</p>
                    </div>
                  )}
                  
                  <Button variant="warning" size="sm" className="w-full">
                    Reorder Items
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}