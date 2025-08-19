import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Users,
  Wrench,
  Package,
  Loader2,
  AlertTriangle,
  FileText,
  Badge,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const KpiCardSkeleton = () => (
  <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-4 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-700 rounded w-1/2"></div>
  </div>
);

export default function ReportsPage() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("month");
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/reports/?period=${timeframe}`
        );
        setReportData(response.data);
      } catch (err) {
        setError("Failed to fetch report data. Please ensure the server is running.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, [timeframe]);

  const handleExport = async () => {
    setIsExporting(true);
    toast.info("Generating your report...");
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/invoices/export/?period=${timeframe}`);
      const invoices = response.data;

      const doc = new jsPDF();
      const tableColumn = ["Invoice ID", "Date", "Customer", "Parts Total", "Labor", "GST", "Discount", "Grand Total"];
      const tableRows = [];

      let totalParts = 0;
      let totalLabor = 0;
      let totalGst = 0;
      let totalDiscount = 0;
      let grandTotal = 0;

      invoices.forEach(invoice => {
        const invoiceData = [
          invoice.id,
          new Date(invoice.created_at).toLocaleDateString("en-IN"),
          invoice.customer_name,
          `Rs. ${parseFloat(invoice.parts_total).toFixed(2)}`,
          `Rs. ${parseFloat(invoice.labor_charge).toFixed(2)}`,
          `Rs. ${parseFloat(invoice.tax).toFixed(2)}`,
          `- Rs. ${parseFloat(invoice.discount).toFixed(2)}`,
          `Rs. ${parseFloat(invoice.total_amount).toFixed(2)}`,
        ];
        tableRows.push(invoiceData);
        
        totalParts += parseFloat(invoice.parts_total);
        totalLabor += parseFloat(invoice.labor_charge);
        totalGst += parseFloat(invoice.tax);
        totalDiscount += parseFloat(invoice.discount);
        grandTotal += parseFloat(invoice.total_amount);
      });

      // --- PDF Header ---
      doc.setFontSize(18).setFont("helvetica", "bold");
      doc.text("AutoServe360 - Financial Report", 14, 22);
      doc.setFontSize(11).setFont("helvetica", "normal");
      doc.text(`Period: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`, 14, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 36);

      // --- PDF Summary Section ---
      doc.setFontSize(12).setFont("helvetica", "bold");
      doc.text("Financial Summary", 14, 50);
      
      // --- THIS IS THE FIX ---
      // Create an array of strings for the summary text. This is a more
      // reliable way to render multi-line text in jsPDF.
      const summaryLines = [
        `Total Revenue (incl. GST): Rs. ${grandTotal.toFixed(2)}`,
        `Total Parts Revenue: Rs. ${totalParts.toFixed(2)}`,
        `Total Labor Revenue: Rs. ${totalLabor.toFixed(2)}`,
        `Total GST Collected: Rs. ${totalGst.toFixed(2)}`,
        `Total Discounts Given: Rs. ${totalDiscount.toFixed(2)}`
      ];
      doc.setFontSize(10).setFont("helvetica", "normal");
      // Pass the array directly to the doc.text method.
      doc.text(summaryLines, 14, 56);

      // --- PDF Table ---
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        headStyles: { fillColor: [250, 204, 21], textColor: [31, 41, 55] }, // Yellow header
        styles: { font: "helvetica", fontSize: 8 },
      });

      doc.save(`Financial_Report_${timeframe}.pdf`);
      toast.success("Report downloaded successfully!");

    } catch (err) {
      toast.error("Failed to export data.");
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (value) => `₹${parseFloat(value || 0).toFixed(2)}`;
  const COLORS = ["#FACC15", "#FB923C", "#60A5FA", "#A78BFA", "#4ADE80"];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">Analytics & Reports</h1>
            <p className="text-gray-400 text-lg">Business insights and garage performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="today" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900">Today</TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900">Week</TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-gray-900">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleExport} disabled={isExporting} variant="outline" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10">
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCardSkeleton /><KpiCardSkeleton /><KpiCardSkeleton /><KpiCardSkeleton />
        </div>
      ) : error ? (
        <Card className="bg-red-500/10 border border-red-500/30"><CardContent className="text-center py-12"><AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-red-400 mb-2">An Error Occurred</h3><p className="text-gray-400">{error}</p></CardContent></Card>
      ) : reportData ? (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{formatCurrency(reportData.financial_kpis.total_revenue)}</div></CardContent></Card>
            <Card className="bg-gray-800 border-gray-700"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Total Labor Revenue</CardTitle><Users className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{formatCurrency(reportData.financial_kpis.total_labor_charge)}</div></CardContent></Card>
            <Card className="bg-gray-800 border-gray-700"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Jobs Completed</CardTitle><Wrench className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{reportData.operational_kpis.jobs_completed}</div></CardContent></Card>
            <Card className="bg-gray-800 border-gray-700"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Avg. Invoice Value</CardTitle><FileText className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{formatCurrency(reportData.financial_kpis.avg_invoice_value)}</div></CardContent></Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-gray-800 border-gray-700"><CardHeader><CardTitle className="text-yellow-400">Revenue Over Time</CardTitle></CardHeader><CardContent className="pl-2"><ResponsiveContainer width="100%" height={300}><LineChart data={reportData.revenue_over_time}><XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} /><Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} /><Line type="monotone" dataKey="revenue" stroke="#FACC15" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card className="bg-gray-800 border-gray-700"><CardHeader><CardTitle className="text-yellow-400">Revenue Breakdown</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={[{ name: 'Parts', value: parseFloat(reportData.financial_kpis.total_parts_cost) }, { name: 'Labor', value: parseFloat(reportData.financial_kpis.total_labor_charge) }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>{[{ name: 'Parts', value: 0 }, { name: 'Labor', value: 0 }].map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}/><Legend /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-gray-800 border-gray-700"><CardHeader><CardTitle className="text-yellow-400">Mechanic Performance</CardTitle></CardHeader><CardContent className="pl-2"><ResponsiveContainer width="100%" height={300}><BarChart data={reportData.operational_kpis.mechanic_performance}><XAxis dataKey="assigned_mechanic__full_name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} /><Bar dataKey="count" fill="#FACC15" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="bg-gray-800 border-gray-700"><CardHeader><CardTitle className="text-yellow-400">Most Used Parts</CardTitle></CardHeader><CardContent className="space-y-2">{reportData.most_used_parts.map((part, index) => (<div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-900/50 rounded-md"><span className="text-white font-medium">{part.part__name}</span><Badge className="bg-yellow-400/20 text-yellow-400">{part.total_quantity} used</Badge></div>))}</CardContent></Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
