import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User,
  Car,
  Wrench,
  Package,
  FileText,
  Camera,
  Signature,
  Timer,
  Play,
  Pause,
  Square
} from "lucide-react";
import { JobCard as JobCardType } from "@/utils/mockData";

interface WorkflowManagerProps {
  job: JobCardType;
  userRole: 'admin' | 'mechanic';
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  estimatedTime: number; // in minutes
  actualTime?: number;
  assignedTo?: string;
  dependencies?: string[];
  checklist?: { id: string; task: string; completed: boolean }[];
}

export function WorkflowManager({ job, userRole }: WorkflowManagerProps) {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<Record<string, number>>({});

  // Mock workflow steps based on service type
  const getWorkflowSteps = (serviceType: string): WorkflowStep[] => {
    const baseSteps = [
      {
        id: 'inspection',
        title: 'Initial Inspection',
        description: 'Perform comprehensive vehicle inspection',
        status: 'completed' as const,
        estimatedTime: 30,
        actualTime: 25,
        checklist: [
          { id: 'visual', task: 'Visual inspection of vehicle exterior', completed: true },
          { id: 'fluids', task: 'Check all fluid levels', completed: true },
          { id: 'tires', task: 'Inspect tire condition and pressure', completed: true },
          { id: 'lights', task: 'Test all lights and signals', completed: true }
        ]
      }
    ];

    if (serviceType.includes('Oil Change')) {
      return [
        ...baseSteps,
        {
          id: 'oil-drain',
          title: 'Drain Old Oil',
          description: 'Remove old engine oil and filter',
          status: 'completed' as const,
          estimatedTime: 15,
          actualTime: 12,
          checklist: [
            { id: 'position', task: 'Position vehicle on lift', completed: true },
            { id: 'drain', task: 'Drain engine oil completely', completed: true },
            { id: 'filter', task: 'Remove old oil filter', completed: true }
          ]
        },
        {
          id: 'oil-refill',
          title: 'Install New Oil & Filter',
          description: 'Install new filter and add fresh oil',
          status: 'in-progress' as const,
          estimatedTime: 20,
          checklist: [
            { id: 'filter-install', task: 'Install new oil filter', completed: true },
            { id: 'oil-add', task: 'Add new engine oil', completed: false },
            { id: 'level-check', task: 'Check oil level and top up', completed: false }
          ]
        },
        {
          id: 'final-check',
          title: 'Final Inspection',
          description: 'Test drive and final quality check',
          status: 'pending' as const,
          estimatedTime: 15,
          checklist: [
            { id: 'test-drive', task: 'Short test drive', completed: false },
            { id: 'leak-check', task: 'Check for oil leaks', completed: false },
            { id: 'cleanup', task: 'Clean work area', completed: false }
          ]
        }
      ];
    }

    // Add more service type specific workflows
    return baseSteps;
  };

  const workflowSteps = getWorkflowSteps(job.serviceType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'blocked': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Timer;
      case 'blocked': return AlertTriangle;
      default: return Clock;
    }
  };

  const calculateProgress = () => {
    const totalSteps = workflowSteps.length;
    const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
    return (completedSteps / totalSteps) * 100;
  };

  const toggleTimer = (stepId: string) => {
    if (activeTimer === stepId) {
      setActiveTimer(null);
    } else {
      setActiveTimer(stepId);
      if (!elapsedTime[stepId]) {
        setElapsedTime(prev => ({ ...prev, [stepId]: 0 }));
      }
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Job Overview Header */}
      <Card className="border-0 shadow-glow bg-gradient-card">
        <CardHeader className="border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Job #{job.id} Workflow</CardTitle>
                  <p className="text-muted-foreground">{job.serviceType}</p>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <Badge className={getStatusColor(job.status)}>
                {job.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Progress: {Math.round(calculateProgress())}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm">Customer</span>
              </div>
              <p className="font-semibold text-foreground">{job.customerName}</p>
              <p className="text-sm text-muted-foreground">{job.customerPhone}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Car className="h-4 w-4" />
                <span className="text-sm">Vehicle</span>
              </div>
              <p className="font-semibold text-foreground">{job.vehicleBrand} {job.vehicleModel}</p>
              <p className="text-sm text-muted-foreground font-mono">{job.vehicleNumber}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Timeline</span>
              </div>
              <p className="font-semibold text-foreground">
                {new Date(job.estimatedCompletion).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(job.estimatedCompletion).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => {
          const StatusIcon = getStatusIcon(step.status);
          const isActive = activeTimer === step.id;
          
          return (
            <Card key={step.id} className={`border-0 shadow-medium transition-all duration-300 ${
              step.status === 'in-progress' ? 'shadow-glow bg-gradient-card' : 'bg-card'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(step.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        Est: {formatTime(step.estimatedTime)}
                      </p>
                      {step.actualTime && (
                        <p className="text-xs text-success">
                          Actual: {formatTime(step.actualTime)}
                        </p>
                      )}
                    </div>
                    {userRole === 'mechanic' && step.status === 'in-progress' && (
                      <Button
                        size="sm"
                        variant={isActive ? "destructive" : "default"}
                        onClick={() => toggleTimer(step.id)}
                        className="transition-all duration-300"
                      >
                        {isActive ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {step.checklist && (
                <CardContent className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Checklist</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.checklist.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                        <CheckCircle 
                          className={`h-4 w-4 ${
                            item.completed ? 'text-success' : 'text-muted-foreground'
                          }`} 
                        />
                        <span className={`text-sm ${
                          item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {userRole === 'mechanic' && step.status === 'in-progress' && (
                    <div className="flex space-x-3 pt-4 border-t border-border/20">
                      <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                        <Camera className="h-3 w-3 mr-1" />
                        Add Photo
                      </Button>
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        <FileText className="h-3 w-3 mr-1" />
                        Add Note
                      </Button>
                      {index === workflowSteps.length - 1 && (
                        <Button size="sm" className="bg-gradient-accent text-primary hover:shadow-glow">
                          <Signature className="h-3 w-3 mr-1" />
                          Customer Sign-off
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}