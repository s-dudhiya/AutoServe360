import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  Wrench,
  FileText,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function WorkflowManager({ job, userRole, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false);

  // The component now uses the real 'tasks' array from the job object.
  const workflowSteps = job?.tasks || [];

  const getStatusColor = (isCompleted) => {
    return isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400';
  };

  const getStatusIcon = (isCompleted) => {
    return isCompleted ? CheckCircle : Clock;
  };

  const calculateProgress = () => {
    if (!workflowSteps || workflowSteps.length === 0) return 0;
    const completedSteps = workflowSteps.filter(step => step.completed).length;
    return (completedSteps / workflowSteps.length) * 100;
  };

  // --- NEW: Function to mark a single task as complete ---
  const handleToggleTask = async (taskId, currentStatus) => {
    setIsLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:8000/api/tasks/${taskId}/update/`, {
        completed: !currentStatus,
      });
      toast.success("Task status updated!");
      onUpdate(); // Tell the parent dashboard to refresh its data
    } catch (err) {
      toast.error("Failed to update task.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Function to mark the entire job as completed ---
  const handleCompleteService = async () => {
    if (!window.confirm("Are you sure you want to mark this entire service as completed?")) {
        return;
    }
    setIsLoading(true);
    try {
        await axios.patch(`http://127.0.0.1:8000/api/jobcards/${job.id}/update-status/`, {
            status: 'done', // 'done' is the backend key for "Completed"
        });
        toast.success("Service marked as completed!");
        onUpdate(); // Tell the parent dashboard to refresh its data
    } catch (err) {
        toast.error("Failed to complete service.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const allTasksCompleted = workflowSteps.every(task => task.completed);

  return (
    <div className="space-y-6">
      {/* Job Overview Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                <Wrench className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Job #{job?.id} Workflow</CardTitle>
                <p className="text-gray-400">{job?.vehicle?.make} {job?.vehicle?.model}</p>
              </div>
            </div>
            <div className="text-right space-y-2">
               <div className="text-sm text-gray-400">
                Progress: {Math.round(calculateProgress())}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="h-2" />
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step) => {
          const StatusIcon = getStatusIcon(step.completed);
          return (
            <Card key={step.id} className={`border-gray-700 transition-all duration-300 ${
              step.completed ? 'bg-gray-800/50' : 'bg-gray-800 shadow-lg'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(step.completed)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${step.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{step.description}</CardTitle>
                      <p className="text-sm text-gray-500">{step.notes || "No notes for this task."}</p>
                    </div>
                  </div>
                  {userRole === 'mechanic' && (
                     <Button 
                        size="sm" 
                        onClick={() => handleToggleTask(step.id, step.completed)}
                        disabled={isLoading}
                        className={step.completed ? "bg-gray-600 hover:bg-gray-700" : "bg-green-500 hover:bg-green-600 text-white"}
                     >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {step.completed ? "Mark as Incomplete" : "Mark as Done"}
                            </>
                        )}
                     </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
      
      {/* Final Completion Button */}
      {userRole === 'mechanic' && allTasksCompleted && job.status !== 'done' && (
        <div className="border-t border-gray-700 pt-6">
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <CheckCircle className="h-12 w-12 text-green-400 mb-2" />
                    <h3 className="text-lg font-bold text-gray-900">All Tasks Completed!</h3>
                    <p className="text-gray-700 mb-4">You can now mark the entire service as completed.</p>
                    <Button onClick={handleCompleteService} disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Service as Completed"}
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
