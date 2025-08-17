import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobCard } from "@/components/jobs/JobCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus,
  FileText
} from "lucide-react";
import { mockJobCards } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const filteredJobs = mockJobCards.filter(job => {
    const matchesSearch = job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || job.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusCounts = {
    all: mockJobCards.length,
    'In Queue': mockJobCards.filter(job => job.status === 'In Queue').length,
    'Under Service': mockJobCards.filter(job => job.status === 'Under Service').length,
    'Awaiting Parts': mockJobCards.filter(job => job.status === 'Awaiting Parts').length,
    'QC': mockJobCards.filter(job => job.status === 'QC').length,
    'Completed': mockJobCards.filter(job => job.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleLogout} />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Job Cards Management</h1>
              <p className="text-muted-foreground">Manage and track all service job cards</p>
            </div>
            <Button variant="hero" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create New Job</span>
            </Button>
          </div>

          {/* Filters and Search */}
          <Card variant="gradient">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-primary" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer, vehicle, or job ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                    <SelectItem value="In Queue">In Queue ({statusCounts['In Queue']})</SelectItem>
                    <SelectItem value="Under Service">Under Service ({statusCounts['Under Service']})</SelectItem>
                    <SelectItem value="Awaiting Parts">Awaiting Parts ({statusCounts['Awaiting Parts']})</SelectItem>
                    <SelectItem value="QC">QC ({statusCounts['QC']})</SelectItem>
                    <SelectItem value="Completed">Completed ({statusCounts['Completed']})</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-foreground">Job Cards</h2>
              <Badge variant="outline">{filteredJobs.length} results</Badge>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onViewDetails={(jobId) => console.log(`View details for ${jobId}`)}
              />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card variant="gradient">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}