import { useState } from "react";
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
  TrendingDown,
  DollarSign,
  Bike,
  Cog,
  Wrench
} from "lucide-react";
import { mockInventory, getLowStockItems } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";

// This component is now clean. It ONLY renders the content for the Inventory page.
// All layout (Sidebar, Navbar, margins, etc.) is handled by MainLayout.jsx.
export default function InventoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const lowStockItems = getLowStockItems();

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = mockInventory.reduce(
    (total, item) => total + item.stock * item.price,
    0
  );

  return (
    // The component now returns a single div with its content.
    // All Sidebar, Navbar, and layout state has been removed.
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
            Parts Inventory Management
          </h1>
          <p className="text-gray-400">
            Track bike parts and service supplies inventory
          </p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-lg flex items-center space-x-2 transform hover:scale-105 transition-all duration-300">
          <Plus className="h-4 w-4" />
          <span>Add New Part</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Parts
                </p>
                <p className="text-2xl font-bold text-white">
                  {mockInventory.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-400/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Low Stock Parts
                </p>
                <p className="text-2xl font-bold text-orange-400">
                  {lowStockItems.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-400/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Value
                </p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{totalValue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-400">
                <Bike className="h-5 w-5" />
                <span>Bike Parts Inventory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search parts, categories, or suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>

                <div className="space-y-3">
                  {filteredInventory.map((item) => (
                    <Card key={item.id} className="bg-gray-900/50 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                              <Cog className="h-4 w-4 text-yellow-400" />
                            </div>
                            <h3 className="font-semibold text-white">
                              {item.name}
                            </h3>
                            <Badge className="bg-gray-700 text-gray-300 text-xs">
                              {item.category}
                            </Badge>
                            {item.stock <= item.minStock && (
                              <Badge className="bg-orange-400/20 border border-orange-400/30 text-orange-400 text-xs">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                Low Stock
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1 ml-11">
                            Supplier: {item.supplier}
                          </p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm text-gray-400">Stock</p>
                              <p className={`font-semibold ${
                                item.stock <= item.minStock
                                  ? "text-orange-400"
                                  : "text-white"
                              }`}>
                                {item.stock}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Min</p>
                              <p className="font-semibold text-white">
                                {item.minStock}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Price</p>
                              <p className="font-semibold text-white">
                                ₹{item.price}
                              </p>
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
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-400/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Critical Stock Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-orange-400/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Wrench className="h-3 w-3 text-orange-400" />
                        <p className="font-medium text-sm text-white">{item.name}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-400">
                        {item.stock} left
                      </p>
                      <p className="text-xs text-gray-400">
                        Min: {item.minStock}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {lowStockItems.length === 0 && (
                <div className="text-center py-6">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    All parts are well stocked!
                  </p>
                </div>
              )}

              <Button className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Reorder Parts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
