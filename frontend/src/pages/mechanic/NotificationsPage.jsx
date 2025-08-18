import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle,
  Clock,
  Package,
  Wrench,
  Settings,
  Trash2,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/mockData";

// This component is now clean. It ONLY renders the content for the Mechanic Notifications page.
// All layout is handled by MainLayout.jsx.
export default function MechanicNotificationsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: "1",
      type: "job",
      title: "New Bike Service Assignment",
      message: "Royal Enfield Classic 350 oil change service has been assigned to you",
      time: "5 minutes ago",
      read: false,
      icon: Wrench,
      color: "primary",
      priority: "high",
    },
    {
      id: "2",
      type: "parts",
      title: "Parts Available",
      message: "Brake pads for Honda Activa (Job #JC-156) are now in stock",
      time: "30 minutes ago",
      read: false,
      icon: Package,
      color: "success",
      priority: "medium",
    },
    {
      id: "3",
      type: "job",
      title: "Service Deadline Approaching",
      message: "Yamaha FZ service deadline is approaching (Due: Today 5:00 PM)",
      time: "1 hour ago",
      read: true,
      icon: Clock,
      color: "warning",
      priority: "high",
    },
    {
      id: "4",
      type: "update",
      title: "Schedule Change",
      message: "Your workshop shift has been extended by 2 hours for today",
      time: "2 hours ago",
      read: false,
      icon: Calendar,
      color: "secondary",
      priority: "medium",
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "jobs":
        return notification.type === "job";
      case "parts":
        return notification.type === "parts";
      case "updates":
        return notification.type === "update";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getColorClasses = (color, read) => {
    const opacity = read ? "20" : "30";
    switch (color) {
      case "warning":
        return `border-orange-400/${opacity} bg-orange-400/10`;
      case "success":
        return `border-green-400/${opacity} bg-green-400/10`;
      case "primary":
        return `border-yellow-400/${opacity} bg-yellow-400/10`;
      case "secondary":
        return `border-blue-400/${opacity} bg-blue-400/10`;
      case "accent":
        return `border-purple-400/${opacity} bg-purple-400/10`;
      default:
        return `border-gray-600/${opacity} bg-gray-700/10`;
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case "warning":
        return "text-orange-400";
      case "success":
        return "text-green-400";
      case "primary":
        return "text-yellow-400";
      case "secondary":
        return "text-blue-400";
      case "accent":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-400/20 text-red-400 border-red-400/30";
      case "medium":
        return "bg-orange-400/20 text-orange-400 border-orange-400/30";
      case "low":
        return "bg-green-400/20 text-green-400 border-green-400/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30";
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <Bell className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
              My Notifications
            </h1>
            <p className="text-gray-400 text-lg">
              Stay updated with your assigned tasks, {currentUser.name}
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500/20 border border-red-500/30 text-red-400 animate-pulse">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 shadow-lg">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="bg-gray-800 border border-gray-700 shadow-lg">
        <CardContent className="p-6">
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full max-w-xl grid-cols-5 bg-gray-900 border border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300">
                Jobs ({notifications.filter((n) => n.type === "job").length})
              </TabsTrigger>
              <TabsTrigger value="parts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300">
                Parts ({notifications.filter((n) => n.type === "parts").length})
              </TabsTrigger>
              <TabsTrigger value="updates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-gray-900 text-gray-300">
                Updates ({notifications.filter((n) => n.type === "update").length})
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
            className={`bg-gray-800 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg ${getColorClasses(
              notification.color,
              notification.read
            )} ${!notification.read ? "ring-1 ring-yellow-400/20" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.color === "warning" ? "bg-orange-400/20"
                      : notification.color === "success" ? "bg-green-400/20"
                      : notification.color === "primary" ? "bg-yellow-400/20"
                      : notification.color === "secondary" ? "bg-blue-400/20"
                      : "bg-purple-400/20"
                  }`}
                >
                  <notification.icon
                    className={`h-5 w-5 ${getIconColor(notification.color)}`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${notification.read ? "text-gray-400" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-300"}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-3">
                        <p className="text-xs text-gray-500">{notification.time}</p>
                        <Badge className={`text-xs capitalize ${getPriorityBadge(notification.priority)}`}>
                          {notification.priority} priority
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {!notification.read && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-400 hover:bg-green-400/10">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:bg-red-400/10">
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
        <Card className="bg-gray-800 border border-gray-700 shadow-lg">
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">No Notifications</h3>
            <p className="text-gray-400">
              {filter === "all" ? "You're all caught up!" : `No ${filter} notifications found`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
