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
  MapPin,
  Cog,
  Calendar,
  TrendingUp,
  Bike,
  Hammer,
  Headphones,
  Award,
  ChevronRight,
  Play,
  BarChart,
  Timer,
  DollarSign,
  Users2,
  Smartphone,
  CircleDot,
  UserCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);

  // Animated counter for stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      const targets = [1200, 85000, 99.8, 24];
      const duration = 2000;
      const steps = 60;
      
      targets.forEach((target, index) => {
        let current = 0;
        const increment = target / steps;
        const stepTimer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(stepTimer);
          }
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = index === 2 ? current.toFixed(1) : Math.floor(current);
            return newStats;
          });
        }, duration / steps);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Digital Job Cards",
      description: "Streamline service orders with digital job cards. Track progress from intake to completion for bikes and mopeds.",
    },
    {
      icon: Bike,
      title: "Two-Wheeler Management",
      description: "Specialized system for motorcycles, scooters, and mopeds with detailed service history and parts tracking.",
    },
    {
      icon: Package,
      title: "Parts Inventory",
      description: "Real-time inventory tracking for bike parts, automatic reorder alerts, and supplier management.",
    },
    {
      icon: Users,
      title: "Customer Portal",
      description: "Keep customers informed with real-time updates, service history, and maintenance reminders.",
    },
    {
      icon: Calendar,
      title: "Smart Booking",
      description: "Online booking system with service type selection, automated reminders, and optimized scheduling.",
    },
    {
      icon: TrendingUp,
      title: "Business Intelligence",
      description: "Revenue tracking, performance metrics, and detailed insights specifically for two-wheeler services.",
    }
  ];

  const stats = [
    { value: `150+`, label: "Active Bike Garages", icon: Wrench },
    { value: `3500+`, label: "Two-Wheelers Serviced", icon: Bike },
    { value: `10k+`, label: "Customer Satisfaction", icon: Star },
    { value: `24/7`, label: "Technical Support", icon: Headphones }
  ];

  const testimonials = [
    {
      name: "Raj Patel",
      role: "Bike Garage Owner",
      garage: "Patel Two-Wheeler Service",
      content: "AutoServe 360 transformed our bike service operations. We're handling 60% more customers with the same staff!",
      rating: 5,
      icon: UserCircle
    },
    {
      name: "Priya Sharma",
      role: "Service Manager", 
      garage: "City Bike Workshop",
      content: "The digital workflow eliminated our paperwork chaos. Perfect for managing both bikes and scooters efficiently.",
      rating: 5,
      icon: UserCircle
    },
    {
      name: "Kumar Singh",
      role: "Workshop Owner",
      garage: "Singh Motorcycle Repair",
      content: "Customer satisfaction increased dramatically since we started using real-time service updates and digital job cards.",
      rating: 5,
      icon: UserCircle
    }
  ];

  const serviceTypes = [
    { name: "Motorcycle Service", icon: Bike, count: "2,500+ monthly" },
    { name: "Scooter Maintenance", icon: Car, count: "3,200+ monthly" },
    { name: "Moped Repair", icon: CircleDot, count: "1,800+ monthly" },
    { name: "Parts Replacement", icon: Cog, count: "5,000+ monthly" }
  ];

  const benefits = [
    {
      icon: Timer,
      title: "50% Faster Service",
      description: "Digital workflows reduce service time significantly"
    },
    {
      icon: DollarSign,
      title: "30% Revenue Increase",
      description: "Better scheduling and customer management"
    },
    {
      icon: Users2,
      title: "2x Customer Retention",
      description: "Improved service quality and communication"
    },
    {
      icon: Smartphone,
      title: "100% Digital",
      description: "Paperless operations with mobile access"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      Custom CSS for animations
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.3); }
          50% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.6); }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .bounce-in { animation: bounce-in 0.6s ease-out; }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 slide-in-left">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg pulse-glow">
              <Bike className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">AutoServe 360</h1>
              <p className="text-xs text-gray-400">Two-Wheeler Service Pro</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 slide-in-right">
            {/* <Button variant="ghost" className="text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300" onClick={() => navigate('/login')}>
              Sign In
            </Button> */}
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500 hover:to-yellow-700 font-semibold shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
        {/* Animated Background Elements */} 
        {/* <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 text-yellow-400/10 float-animation">
            <Bike className="w-full h-full" />
          </div>
          <div className="absolute top-3/4 right-1/4 w-32 h-32 text-yellow-400/10 float-animation stagger-2">
            <Car className="w-full h-full" />
          </div>
          <div className="absolute bottom-1/4 left-3/4 w-32 h-32 text-yellow-400/10 float-animation stagger-3">
            <Cog className="w-full h-full" />
          </div>
        </div> */}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="slide-in-left">
              {/* <Badge className="mb-6 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 bounce-in">
                <Bike className="w-3 h-3 mr-2" />
                Complete Two-Wheeler Solution
              </Badge> */}
              
              <h1 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
                Revolutionize Your
                <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                  Bike Service
                </span>
                Business
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The most advanced digital platform for motorcycle, scooter, and moped service centers. 
                Manage everything from quick repairs to major overhauls with professional precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-500  hover:to-yellow-700 font-semibold shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {/* <Button 
                  size="lg"
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button> */}
              </div>

              {/* Service Types */}
              <div className="grid grid-cols-2 gap-4">
                {serviceTypes.map((service, index) => (
                  <div key={index} className={`text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 bounce-in stagger-${index + 1}`}>
                    <div className="text-2xl mb-1 flex justify-center">
                      <service.icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="text-sm text-yellow-400 font-semibold">{service.count}</div>
                    <div className="text-xs text-gray-400">{service.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative slide-in-right">
              {/* Enhanced Hero Visual */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 hover:border-yellow-400/30 transition-all duration-500">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-6 hover:bg-yellow-400/15 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                        <Bike className="h-6 w-6 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-400">Live Service Tracking</h3>
                        <p className="text-sm text-gray-400">Real-time bike service updates</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm flex items-center">
                          
                          Engine Service - Royal Enfield
                        </span>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">75% Complete</Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm flex items-center">
                        
                          Oil Change - Honda Activa
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">Starting</Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-1000" style={{width: '25%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                      <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">1.8 hrs</p>
                      <p className="text-gray-400 text-xs">Avg. Service Time</p>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                      <Shield className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-white font-semibold">Certified</p>
                      <p className="text-gray-400 text-xs">Quality Service</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-16 px-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center p-6 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 ${isVisible ? 'bounce-in' : 'opacity-0'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <stat.icon className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Why Choose AutoServe 360?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Proven results from two-wheeler service centers across the country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-yellow-400/10 hover:shadow-lg group">
                <benefit.icon className="h-12 w-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Built for Two-Wheeler Specialists
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for motorcycle, scooter, and moped service centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/10 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto group-hover:pulse-glow">
                    <feature.icon className="h-8 w-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Trusted by Bike Service Experts
            </h2>
            <p className="text-lg text-gray-400">
              Real stories from two-wheeler service professionals using AutoServe 360
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border border-gray-700 hover:border-yellow-400/30 transition-all duration-300 transform hover:scale-105 group">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="mb-3 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <testimonial.icon className="w-12 h-12 text-yellow-400" />
                    </div>
                    <div className="flex justify-center items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 italic text-center">
                    "{testimonial.content}"
                  </p>
                  <div className="text-center">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    <p className="text-yellow-400 text-sm font-medium">{testimonial.garage}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      {/* <section className="py-20 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 text-gray-900/10 float-animation">
            <Bike className="w-full h-full" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 text-gray-900/10 float-animation stagger-2">
            <Car className="w-full h-full" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black text-gray-900 mb-6">
            Ready to Transform Your Bike Service Business?
          </h2>
          <p className="text-xl text-gray-800 mb-10">
            Join over 1,200 two-wheeler service centers already using AutoServe 360 to deliver exceptional customer experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gray-900 text-yellow-400 hover:bg-gray-800 shadow-lg font-semibold hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              Start Your Free Trial
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-gray-900 text-gray-900 hover:bg-gray-900/10 hover:scale-105 transition-all duration-300"
            >
              Schedule Demo
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section> */}

      {/* Enhanced Footer */}
      <footer className="py-12 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Bike className="h-5 w-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-yellow-400">AutoServe 360</span>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Professional two-wheeler service management software designed by automotive experts.
            </p>
            <div className="flex justify-center space-x-8 mb-4 text-gray-500">
              <span className="hover:text-yellow-400 cursor-pointer transition-colors flex items-center">
                <Bike className="w-4 h-4 mr-1" />
                Motorcycles
              </span>
              <span className="hover:text-yellow-400 cursor-pointer transition-colors flex items-center">
                <Car className="w-4 h-4 mr-1" />
                Scooters
              </span>
              <span className="hover:text-yellow-400 cursor-pointer transition-colors flex items-center">
                <CircleDot className="w-4 h-4 mr-1" />
                Mopeds
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 AutoServe 360. All rights reserved. • Powering Modern Two-Wheeler Service Centers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
