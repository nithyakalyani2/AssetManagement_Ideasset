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

import NotFound from "./pages/NotFound";
import MyComplaints from "./pages/employee/MyComplaints";
import SubmitComplaint from "./pages/employee/SubmitComplaint";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Employee Routes */}
          <Route path="/" element={<MyAssets />} />
          <Route path="/request" element={<RequestAsset />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/requests" element={<Requests />} />
          <Route path="/admin/employees" element={<Employees />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
