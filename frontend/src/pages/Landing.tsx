import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  FileText, 
  Users, 
  Package, 
  BarChart3, 
  UserCheck, 
  CheckCircle, 
  ArrowRight,
  Settings,
  Car,
  Clock,
  Shield,
  Star,
  Zap,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-garage.jpg";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Digital Job Cards",
      description: "Create, track, and manage job cards digitally with real-time status updates."
    },
    {
      icon: Users,
      title: "Customer CRM",
      description: "Comprehensive customer management with service history and preferences."
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track parts, manage stock levels, and automate reorder alerts."
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Revenue insights, performance metrics, and detailed reporting."
    },
    {
      icon: UserCheck,
      title: "Staff Management",
      description: "Assign tasks, track productivity, and manage technician schedules."
    },
    {
      icon: Settings,
      title: "Workflow Automation",
      description: "Streamline processes with automated notifications and updates."
    }
  ];

  const stats = [
    { value: "500+", label: "Active Garages" },
    { value: "50K+", label: "Job Cards Processed" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "24/7", label: "Support Available" }
  ];

  const testimonials = [
    {
      name: "John Peterson",
      role: "Garage Owner",
      content: "AutoServe 360 transformed our service operations. We're 40% more efficient now!",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Service Manager", 
      content: "The digital job cards and real-time tracking have improved our customer satisfaction significantly.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AutoServe 360</h1>
              <p className="text-xs text-muted-foreground">Digital Garage Solution</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-accent text-accent-foreground">
            <Star className="w-3 h-3 mr-2" />
            Complete Digital Garage Solution
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            AutoServe 360
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Complete Digital Garage & Job Card Management System
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Manage job cards, inventory, billing, and customers in one powerful platform. 
            Streamline your garage operations with our comprehensive digital solution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/login')}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10"
            >
              Try Demo
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Hero Image/Illustration Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-gradient-card rounded-3xl p-8 shadow-strong border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Vehicle Management</h3>
                  <p className="text-sm text-muted-foreground">Complete service history tracking</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">Live job status tracking</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Secure & Reliable</h3>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-muted/20 to-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4">
              Everything Your Garage Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for automotive service centers and garages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-medium bg-gradient-card hover:shadow-strong transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Transform Your Garage?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join hundreds of garages already using AutoServe 360 to streamline their operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 shadow-medium"
              onClick={() => navigate('/login')}
            >
              Start Free Trial
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AutoServe 360</span>
          </div>
          <p className="text-secondary-foreground/80">
            © 2024 AutoServe 360. All rights reserved. • Professional Garage Management Solution
          </p>
        </div>
      </footer>
    </div>
  );
}