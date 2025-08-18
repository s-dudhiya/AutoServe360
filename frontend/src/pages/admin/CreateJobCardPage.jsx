import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  UserPlus,
  Car,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  Bike,
} from "lucide-react";

const parseApiErrors = (errorData) => {
    if (!errorData) return "An unknown error occurred.";
    if (typeof errorData === 'string') return errorData;
    let messages = [];
    const findErrors = (obj, prefix = '') => {
        for (const key in obj) {
            const value = obj[key];
            const newPrefix = prefix ? `${prefix} -> ${key}` : key;
            if (Array.isArray(value)) {
                messages.push(`${newPrefix}: ${value.join(', ')}`);
            } else if (typeof value === 'object' && value !== null) {
                findErrors(value, newPrefix);
            }
        }
    };
    findErrors(errorData);
    return messages.join(' | ') || "Failed to create job card. Please check all fields.";
};

export default function CreateJobCardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [registrationNo, setRegistrationNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicleData, setVehicleData] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", email: "" });
  const [vehicleForm, setVehicleForm] = useState({ make: "", model: "", vehicle_type: "bike" });
  const [tasks, setTasks] = useState([{ description: "" }]);
  const [assignedMechanicId, setAssignedMechanicId] = useState("");

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/mechanics/");
        setMechanics(response.data);
      } catch (err) {
        console.error("Failed to fetch mechanics:", err);
        setError("Could not load mechanics list.");
      }
    };
    fetchMechanics();
  }, []);

  const handleVehicleSearch = async () => {
    if (!registrationNo.trim()) {
      setError("Please enter a vehicle registration number.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/vehicles/find/?registration_no=${registrationNo}`
      );
      setVehicleData(response.data);
      setStep(2);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setVehicleData(null);
        setStep(2);
      } else {
        setError("An error occurred while searching for the vehicle.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJobCard = async () => {
    setIsLoading(true);
    setError("");

    if (!vehicleData) {
      if (!customerForm.name.trim() || !customerForm.phone.trim() || !vehicleForm.make.trim() || !vehicleForm.model.trim()) {
        setError("Please fill in all required customer and vehicle fields.");
        setIsLoading(false);
        return;
      }
      if (isNaN(parseInt(customerForm.phone))) {
        setError("Phone number must be a valid number.");
        setIsLoading(false);
        return;
      }
    }
    if (tasks.some(task => !task.description.trim())) {
      setError("All service tasks must have a description.");
      setIsLoading(false);
      return;
    }
    if (!assignedMechanicId) {
      setError("Please assign a mechanic.");
      setIsLoading(false);
      return;
    }

    let payload = {
      tasks: tasks.filter(task => task.description.trim()),
      assigned_mechanic_id: parseInt(assignedMechanicId),
    };

    if (vehicleData) {
      payload.customer_id = vehicleData.customer.id;
      payload.vehicle_id = vehicleData.id;
      payload.customer = {
          name: vehicleData.customer.name,
          phone: parseInt(vehicleData.customer.phone), 
          email: vehicleData.customer.email || ""
      };
      payload.vehicle = {
          make: vehicleData.make,
          model: vehicleData.model,
          registration_no: vehicleData.registration_no,
          vehicle_type: vehicleData.vehicle_type
      };
    } else {
      payload.customer = {
          ...customerForm,
          phone: parseInt(customerForm.phone)
      };
      payload.vehicle = { ...vehicleForm, registration_no: registrationNo };
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/jobcards/", payload);
      toast.success("Job Card Created Successfully!");
      navigate("/admin/jobs");
    } catch (err) {
      const errorData = err.response?.data;
      setError(parseApiErrors(errorData));
      console.error("API Error:", err.response?.data || err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].description = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { description: "" }]);
  };

  const removeTask = (index) => {
    if (tasks.length > 1) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const resetForm = () => {
    setStep(1);
    setRegistrationNo("");
    setVehicleData(null);
    setError("");
    setCustomerForm({ name: "", phone: "", email: "" });
    setVehicleForm({ make: "", model: "", vehicle_type: "bike" });
    setTasks([{ description: "" }]);
    setAssignedMechanicId("");
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline"  className="border-gray-700 text-gray-900 hover:bg-gray-700 hover:text-yellow-400" size="icon" onClick={() => step > 1 ? resetForm() : navigate('/admin/jobs')}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold text-yellow-400">Create New Job Card</h1>
            <p className="text-gray-400">Follow the steps to register a new service job.</p>
        </div>
      </div>

      {/* Step 1: Vehicle Search */}
      {step === 1 && (
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-400">
              <Search className="h-5 w-5" />
              <span>Find Vehicle</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter the vehicle's registration number to begin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                placeholder="e.g., GJ01AB1234"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value.toUpperCase())}
                className="pl-4 bg-gray-900 text-white border-gray-700 focus:border-yellow-400 text-lg placeholder:text-gray-500"
              />
              <Button onClick={handleVehicleSearch} disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                {isLoading ? <Loader2 className="animate-spin" /> : "Search Vehicle"}
              </Button>
            </div>
            {error && <p className="text-red-400 mt-2">{error}</p>}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Customer & Vehicle Details */}
      {step === 2 && (
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-400">
              <UserPlus className="h-5 w-5" />
              <span>Confirm Details</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              {vehicleData ? "Vehicle found. Please confirm the details below." : "New vehicle. Please enter customer and vehicle details."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {vehicleData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Customer Details</h3>
                  <p className="text-gray-300"><strong>Name:</strong> {vehicleData.customer.name}</p>
                  <p className="text-gray-300"><strong>Phone:</strong> {vehicleData.customer.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Vehicle Details</h3>
                  <p className="text-gray-300"><strong>Reg. No:</strong> {vehicleData.registration_no}</p>
                  <p className="text-gray-300"><strong>Make:</strong> {vehicleData.make}</p>
                  <p className="text-gray-300"><strong>Model:</strong> {vehicleData.model}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <h3 className="font-semibold text-white">New Customer</h3>
                      <Input placeholder="Full Name" value={customerForm.name} onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})} className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500" />
                      <Input placeholder="Phone Number" type="tel" value={customerForm.phone} onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})} className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500" />
                      <Input placeholder="Email (Optional)" type="email" value={customerForm.email} onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})} className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500" />
                  </div>
                  <div className="space-y-4">
                      <h3 className="font-semibold text-white">New Vehicle</h3>
                      <Input readOnly value={registrationNo} className="bg-gray-700 border-gray-600 text-white" />
                      <Input placeholder="Make (e.g., Royal Enfield)" value={vehicleForm.make} onChange={(e) => setVehicleForm({...vehicleForm, make: e.target.value})} className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500" />
                      <Input placeholder="Model (e.g., Classic 350)" value={vehicleForm.model} onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})} className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500" />
                      <Select value={vehicleForm.vehicle_type} onValueChange={(value) => setVehicleForm({...vehicleForm, vehicle_type: value})}>
                          <SelectTrigger className="bg-gray-900 text-white border-gray-700"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="bike">Bike</SelectItem><SelectItem value="moped">Moped</SelectItem></SelectContent>
                      </Select>
                  </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setStep(3)} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 ml-auto">
              Proceed to Job Details
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Job Card Details */}
      {step === 3 && (
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-400">
              <Bike className="h-5 w-5" />
              <span>Service Details</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Add service tasks and assign a mechanic to the job.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-semibold text-white mb-2 block">Service Checklist</Label>
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder={`Task #${index + 1}`}
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500"
                  />
                  <Button variant="destructive" size="icon" onClick={() => removeTask(index)} disabled={tasks.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addTask} className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            <div>
              <Label className="font-semibold text-white mb-2 block">Assign Mechanic</Label>
              <Select value={assignedMechanicId} onValueChange={setAssignedMechanicId}>
                <SelectTrigger className="bg-gray-900 text-white border-gray-700">
                  <SelectValue placeholder="Select a mechanic..." />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map(mechanic => (
                    <SelectItem key={mechanic.id} value={mechanic.id.toString()}>
                      {mechanic.full_name} ({mechanic.pending_jobs_count} pending)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateJobCard} disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white ml-auto">
              {isLoading ? <Loader2 className="animate-spin" /> : "Create Job Card"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
