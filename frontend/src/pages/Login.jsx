import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bike, 
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  Cog,
  Car
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    pin: ""
  });
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || null;

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
      login(data);

      if (from) {
        navigate(from, { replace: true });
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
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.3); }
          50% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.6); }
        }
        @keyframes slide-in-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .slide-in-up { animation: slide-in-up 0.8s ease-out; }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 text-yellow-400/10 float-animation">
          <Bike className="w-full h-full" />
        </div>
        <div className="absolute top-3/4 right-1/4 w-32 h-32 text-yellow-400/10 float-animation" style={{ animationDelay: '2s' }}>
          <Car className="w-full h-full" />
        </div>
        <div className="absolute bottom-1/4 left-3/4 w-32 h-32 text-yellow-400/10 float-animation" style={{ animationDelay: '4s' }}>
          <Cog className="w-full h-full" />
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md slide-in-up">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
                <Bike className="h-8 w-8 text-gray-900" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                  AutoServe 360
                </h1>
                <p className="text-sm text-gray-400 font-medium">Two-Wheeler Service Pro</p>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-400">Access your digital garage dashboard</p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="bg-gray-800/50 border border-gray-700 hover:border-yellow-400/30 transition-all duration-300 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-8 space-y-8">
              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 flex items-center justify-center">
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl relative max-w-md w-full text-center">
                    <span className="block font-semibold">{errorMsg}</span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base font-semibold text-white">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="h-14 text-base border-2 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400/20 bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400"
                      disabled={isLoading}
                    />
                  </div>

                  {/* PIN */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="pin" className="text-base font-semibold text-white">
                      PIN
                    </Label>
                    <Input
                      id="pin"
                      name="pin"
                      type={showPin ? "text" : "password"}
                      placeholder="Enter your PIN"
                      value={formData.pin}
                      onChange={handleInputChange}
                      required
                      className="h-14 text-base border-2 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400/20 bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPin}
                      className="absolute top-1/2 right-3 -translate-y-1 text-gray-400 hover:text-yellow-400 focus:outline-none transition-colors duration-200"
                      tabIndex={-1}
                      aria-label={showPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  ) : (
                    <Bike className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  )}
                  {isLoading ? "Accessing Dashboard..." : "Access Dashboard"}
                </Button>
              </form>

              {/* Back to Home */}
              <div className="text-center mt-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group"
                >
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Need an account? Contact your garage administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
