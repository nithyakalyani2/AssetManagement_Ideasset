import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Employee pages
import MyAssets from "./pages/employee/MyAssets";
import RequestAsset from "./pages/employee/RequestAsset";
import MyRequests from "./pages/employee/MyRequests";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Inventory from "./pages/admin/Inventory";
import Requests from "./pages/admin/Requests";
import Employees from "./pages/admin/Employees";
import AdminComplaints from "./pages/admin/Complaints";

// Other pages
import NotFound from "./pages/NotFound";
import MyComplaints from "./pages/employee/MyComplaints";
import SubmitComplaint from "./pages/employee/SubmitComplaint";
import Login from "./pages/Login";
import Index from "./pages/Index";
import AssetHistory from "./pages/admin/AssetHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<Index />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Employee Routes */}
          <Route path="/my-assets" element={<MyAssets />} />
          <Route path="/request" element={<RequestAsset />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/requests" element={<Requests />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/asset-history" element={<AssetHistory />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
