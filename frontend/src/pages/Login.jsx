import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Settings, 
  User, 
  ArrowLeft,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  Car,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading and then navigate based on email
    setTimeout(() => {
      if (formData.email.includes('admin') || formData.email === '') {
        handleAdminLogin();
      } else {
        handleMechanicLogin();
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleAdminLogin = () => {
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userEmail', formData.email || 'admin@autoserve360.com');
    navigate('/admin');
  };

  const handleMechanicLogin = () => {
    localStorage.setItem('userRole', 'mechanic');
    localStorage.setItem('userEmail', formData.email || 'mechanic@autoserve360.com');
    navigate('/mechanic');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-secondary/40 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-yellow animate-pulse">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-modern bg-clip-text text-transparent">AutoServe 360</h1>
              <p className="text-sm text-primary/70 font-medium">Digital Garage CRM</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
            <p className="text-primary/80">Access your digital garage dashboard</p>
          </div>
        </div>

        <Card className="shadow-glow border-0 bg-gradient-card backdrop-blur-xl">
          <CardContent className="p-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@autoserve360.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-14 text-base border-2 border-primary/20 focus:border-secondary focus:ring-secondary/20 bg-background/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-semibold text-foreground">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter any password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-14 text-base border-2 border-primary/20 focus:border-secondary focus:ring-secondary/20 bg-background/80 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-base font-semibold bg-gradient-accent shadow-yellow hover:shadow-glow transition-all duration-300 transform hover:scale-105 group" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <Car className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                )}
                {isLoading ? "Accessing Dashboard..." : "Access Dashboard"}
              </Button>
            </form>

            {/* Demo Info Card */}
            <div className="bg-gradient-modern/10 border-2 border-secondary/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <Loader2 className="w-3 h-3 text-primary animate-spin" />
                </div>
                <h3 className="font-bold text-foreground">Demo Accounts</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-primary">Admin Dashboard</p>
                    <p className="text-muted-foreground">admin@autoserve360.com</p>
                  </div>
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-secondary">Mechanic Panel</p>
                    <p className="text-muted-foreground">mike@autoserve360.com</p>
                  </div>
                  <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need an account?{" "}
                <span className="text-secondary font-semibold">
                  Contact your garage administrator
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-primary/80 hover:text-secondary hover:bg-secondary/10 transition-all duration-300 group"
          >
            <ArrowRight className="mr-2 h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}