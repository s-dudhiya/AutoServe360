import { useState, useEffect } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailsModal } from "@/components/jobs/JobDetailsModal"; // Import the new modal
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// A simple skeleton component for the loading state
const JobCardSkeleton = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4"><div className="h-4 bg-gray-700 rounded w-1/4"></div><div className="h-6 bg-gray-700 rounded w-1/3"></div></div>
    <div className="space-y-2 mb-4"><div className="h-4 bg-gray-700 rounded w-1/2"></div><div className="h-4 bg-gray-700 rounded w-3/4"></div></div>
    <div className="h-8 bg-gray-700 rounded w-full"></div>
  </div>
);

// --- THIS IS THE CORRECTED FUNCTION ---
// It no longer uses the `new Date()` object, which prevents timezone issues.
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    // The date string is like "2025-08-17 23:45:40.000000"
    // We only care about the date part "2025-08-17"
    const datePart = dateString.split(' ')[0]; // -> "2025-08-17"
    const [year, month, day] = datePart.split('-'); // -> ["2025", "08", "17"]
    
    // Reassemble in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

export default function JobsPage() {
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // State for the details modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIsLoading, setModalIsLoading] = useState(false);

  const statusMap = {
    queue: "In Queue", service: "Under Service", parts: "Awaiting Parts",
    qc: "QC", done: "Completed",
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/jobcards/");
        const transformedData = response.data.map(job => ({
          ...job,
          id: job.id.toString(),
          status: statusMap[job.status] || job.status,
          customerName: job.customer?.name || 'N/A',
          vehicleNumber: job.vehicle?.registration_no || 'N/A',
          vehicleBrand: job.vehicle?.make || 'N/A',
          vehicleModel: job.vehicle?.model || 'N/A',
          // Create a new property with the correctly formatted date
          formattedCreatedAt: formatDate(job.created_at),
        }));
        setJobs(transformedData);
      } catch (err) {
        setError("Failed to fetch job cards. Please ensure the server is running.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Function to handle opening the modal and fetching details
  const handleViewDetails = async (jobId) => {
    setIsModalOpen(true);
    setModalIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/jobcards/${jobId}/`);
      setSelectedJob(response.data);
    } catch (err) {
      console.error("Failed to fetch job details:", err);
      // You can set an error state for the modal here if you want
    } finally {
      setModalIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: jobs.length,
    "In Queue": jobs.filter((job) => job.status === "In Queue").length,
    "Under Service": jobs.filter((job) => job.status === "Under Service").length,
    "Awaiting Parts": jobs.filter((job) => job.status === "Awaiting Parts").length,
    QC: jobs.filter((job) => job.status === "QC").length,
    Completed: jobs.filter((job) => job.status === "Completed").length,
  };

  return (
    <>
      <JobDetailsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        job={selectedJob} 
        isLoading={modalIsLoading} 
      />
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Job Cards Management</h1>
            <p className="text-gray-400">Manage and track all service job cards</p>
          </div>
          <Button onClick={() => navigate("/admin/jobs/create")} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-lg flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create New Job</span>
          </Button>
        </div>

        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-400"><Filter className="h-5 w-5" /><span>Filters</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by customer, vehicle, or job ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-gray-900 text-white border-gray-700 focus:border-yellow-400" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-900 text-white border-gray-700 focus:border-yellow-400">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                  <SelectItem value="In Queue">In Queue ({statusCounts["In Queue"]})</SelectItem>
                  <SelectItem value="Under Service">Under Service ({statusCounts["Under Service"]})</SelectItem>
                  <SelectItem value="Awaiting Parts">Awaiting Parts ({statusCounts["Awaiting Parts"]})</SelectItem>
                  <SelectItem value="QC">QC ({statusCounts["QC"]})</SelectItem>
                  <SelectItem value="Completed">Completed ({statusCounts["Completed"]})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-yellow-400">Job Cards</h2>
            <Badge variant="outline" className="border-yellow-400 text-yellow-400">{filteredJobs.length} results</Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <JobCardSkeleton /><JobCardSkeleton /><JobCardSkeleton />
          </div>
        ) : error ? (
          <Card className="bg-red-500/10 border border-red-500/30"><CardContent className="text-center py-12"><AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-red-400 mb-2">An Error Occurred</h3><p className="text-gray-400">{error}</p></CardContent></Card>
        ) : (
          <>
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} onViewDetails={handleViewDetails} />
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border border-gray-700"><CardContent className="text-center py-12"><FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-yellow-400 mb-2">No jobs found</h3><p className="text-gray-400">Try adjusting your search or filter criteria.</p></CardContent></Card>
            )}
          </>
        )}
      </div>
    </>
  );
}
