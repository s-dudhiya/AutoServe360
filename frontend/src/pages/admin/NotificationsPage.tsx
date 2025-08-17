import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  User,
  DollarSign,
  Settings,
  Trash2,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts' | 'jobs' | 'system'>('all');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const notifications = [
    {
      id: "1",
      type: "alert",
      title: "Low Stock Alert",
      message: "Brake pads are running low (5 units remaining)",
      time: "2 minutes ago",
      read: false,
      icon: AlertTriangle,
      color: "warning"
    },
    {
      id: "2",
      type: "job",
      title: "Job Completed",
      message: "Service for Honda Civic (Job #JC-2024-156) has been completed",
      time: "15 minutes ago",
      read: false,
      icon: CheckCircle,
      color: "success"
    },
    {
      id: "3",
      type: "alert",
      title: "Payment Overdue",
      message: "Invoice #INV-2024-089 is 7 days overdue",
      time: "1 hour ago",
      read: true,
      icon: DollarSign,
      color: "destructive"
    },
    {
      id: "4",
      type: "job",
      title: "New Job Assignment",
      message: "Oil change service assigned to Mike Johnson",
      time: "2 hours ago",
      read: false,
      icon: User,
      color: "primary"
    },
    {
      id: "5",
      type: "system",
      title: "System Backup Complete",
      message: "Daily backup completed successfully at 3:00 AM",
      time: "6 hours ago",
      read: true,
      icon: Settings,
      color: "secondary"
    },
    {
      id: "6",
      type: "alert",
      title: "Equipment Maintenance Due",
      message: "Hydraulic lift #2 requires scheduled maintenance",
      time: "1 day ago",
      read: false,
      icon: Package,
      color: "warning"
    },
    {
      id: "7",
      type: "job",
      title: "Job Delayed",
      message: "BMW 3 Series service delayed due to part availability",
      time: "1 day ago",
      read: true,
      icon: Clock,
      color: "secondary"
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'alerts': return notification.type === 'alert';
      case 'jobs': return notification.type === 'job';
      case 'system': return notification.type === 'system';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getColorClasses = (color: string, read: boolean) => {
    const opacity = read ? "20" : "30";
    switch (color) {
      case 'warning': return `border-warning/${opacity} bg-warning/5`;
      case 'success': return `border-success/${opacity} bg-success/5`;
      case 'destructive': return `border-destructive/${opacity} bg-destructive/5`;
      case 'primary': return `border-primary/${opacity} bg-primary/5`;
      case 'secondary': return `border-secondary/${opacity} bg-secondary/5`;
      default: return `border-muted/${opacity} bg-muted/5`;
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      case 'destructive': return 'text-destructive';
      case 'primary': return 'text-primary';
      case 'secondary': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleLogout} />
        
        <main className="flex-1 p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center animate-pulse">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-modern bg-clip-text text-transparent">
                    Notifications
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Stay updated with your garage operations
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <Card variant="gradient">
            <CardContent className="p-6">
              <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-muted/30">
                  <TabsTrigger value="all">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="alerts">
                    Alerts ({notifications.filter(n => n.type === 'alert').length})
                  </TabsTrigger>
                  <TabsTrigger value="jobs">
                    Jobs ({notifications.filter(n => n.type === 'job').length})
                  </TabsTrigger>
                  <TabsTrigger value="system">
                    System ({notifications.filter(n => n.type === 'system').length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                variant="interactive" 
                className={`transition-all duration-300 hover:shadow-medium ${getColorClasses(notification.color, notification.read)} ${
                  !notification.read ? 'ring-1 ring-primary/20' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      notification.color === 'warning' ? 'bg-warning/20' :
                      notification.color === 'success' ? 'bg-success/20' :
                      notification.color === 'destructive' ? 'bg-destructive/20' :
                      notification.color === 'primary' ? 'bg-primary/20' :
                      notification.color === 'secondary' ? 'bg-secondary/20' :
                      'bg-muted/20'
                    }`}>
                      <notification.icon className={`h-5 w-5 ${getIconColor(notification.color)}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-semibold ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.type}
                          </Badge>
                          <div className="flex space-x-1">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <Card variant="gradient">
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications found`}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}