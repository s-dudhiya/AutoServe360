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
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    pin: ""
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const toggleShowPin = () => {
    setShowPin(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: formData.username,
        pin: Number(formData.pin),
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const data = response.data;
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);

      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "mechanic") {
        navigate("/mechanic");
      } else {
        setErrorMsg("Unauthorized role");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.error ||
        error.message ||
        "Login failed."
      );
    } finally {
      setIsLoading(false);
    }
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
            {/* Error Popup */}
            {errorMsg && (
              <div className="mb-4 flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md w-full">
                  <span className="block font-semibold">{errorMsg}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base font-semibold text-foreground">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="h-14 text-base border-2 border-primary/20 focus:border-secondary focus:ring-secondary/20 bg-background/80 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="pin" className="text-base font-semibold text-foreground">PIN</Label>
                  <Input
                    id="pin"
                    name="pin"
                    type={showPin ? "text" : "password"}
                    placeholder="Enter your PIN"
                    value={formData.pin}
                    onChange={handleInputChange}
                    required
                    className="h-14 text-base border-2 border-primary/20 focus:border-secondary focus:ring-secondary/20 bg-background/80 backdrop-blur-sm pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPin}
                    className="absolute top-1/2 right-2 -translate-y-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
