import { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, KeyRound, Save, AlertTriangle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth(); // comes from AuthContext
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [pinData, setPinData] = useState({
    current_pin: "",
    new_pin: "",
    new_pin_confirm: "",
  });

  // show/hide toggle states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) {
    return (
      <Card className="bg-red-500/10 border border-red-500/30 mt-10">
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Not Logged In
          </h3>
          <p className="text-gray-400">Please log in again to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  const handlePinChange = (e) => {
    const { name, value } = e.target;
    setPinData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pinData.new_pin !== pinData.new_pin_confirm) {
      toast.error("New PINs do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/${user.id}/change-pin/`,
        {
          current_pin: pinData.current_pin,
          new_pin: pinData.new_pin,
          new_pin_confirm: pinData.new_pin_confirm,
        }
      );
      toast.success(response.data.success || "PIN updated successfully! Please log in again.");
      logout();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to change PIN.";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 ">
      {/* Back Arrow */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => {if (user?.role === "admin") {
                             navigate("/admin");
                         } else if (user?.role === "mechanic") {
                         navigate("/mechanic");
                        }}}
          className="p-2 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-yellow-500 hover:border-yellow-500 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
          Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* User Details */}
        <Card className="lg:col-span-1 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-400">
              <User className="mr-2" /> User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div>
              <Label className="text-gray-500">Full Name</Label>
              <p>{user.full_name}</p>
            </div>
            <div>
              <Label className="text-gray-500">Username</Label>
              <p>{user.username}</p>
            </div>
            <div>
              <Label className="text-gray-500">Role</Label>
              <p className="capitalize">{user.role}</p>
            </div>
            <div>
              <Label className="text-gray-500">Email</Label>
              <p>{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Change PIN */}
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-400">
              <KeyRound className="mr-2" /> Change PIN
            </CardTitle>
            <CardDescription className="text-gray-400">
              For security, you will be logged out after a successful PIN change.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              {/* Current PIN */}
              <div className="space-y-2 relative">
                <Label htmlFor="current_pin">Current PIN</Label>
                <Input
                  id="current_pin"
                  name="current_pin"
                  type={showCurrent ? "text" : "password"}
                  required
                  value={pinData.current_pin}
                  onChange={handlePinChange}
                  className="bg-gray-700 text-white border-gray-700 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-yellow-400"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New PIN */}
                <div className="space-y-2 relative">
                  <Label htmlFor="new_pin">New PIN</Label>
                  <Input
                    id="new_pin"
                    name="new_pin"
                    type={showNew ? "text" : "password"}
                    required
                    value={pinData.new_pin}
                    onChange={handlePinChange}
                    className="bg-gray-700 text-white border-gray-700 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-yellow-400"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm PIN */}
                <div className="space-y-2 relative">
                  <Label htmlFor="new_pin_confirm">Confirm New PIN</Label>
                  <Input
                    id="new_pin_confirm"
                    name="new_pin_confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    value={pinData.new_pin_confirm}
                    onChange={handlePinChange}
                    className="bg-gray-700 text-white border-gray-700 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-yellow-400"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
