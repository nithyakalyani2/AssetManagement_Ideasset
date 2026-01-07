import { useEffect, useState } from "react";
import axios from "axios";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  RequestCard,
} from "@/components/requests/RequestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

interface AssetRequestResponse {
  id: number;
  deviceType?: string;
  reason?: string;
  status: RequestStatus | string;
  createdAt?: string;
  updatedAt?: string;
  user?: { id?: number; name?: string; email?: string } | null;
  assignedUser?: { id?: number; name?: string } | null;
  assignedAssetId?: number | null;
}

const API_BASE = "http://localhost:3000";

export default function Requests() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<RequestStatus>("PENDING");
  const [requests, setRequests] = useState<AssetRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Normalize API data: ensure `user` and `assignedUser` exist
  const normalizeRequest = (
    req: AssetRequestResponse
  ): AssetRequestResponse => ({
    ...req,
    user: req.user ?? { name: "Unknown User" },
    assignedUser: req.assignedUser ?? null,
    deviceType: req.deviceType ?? "-",
    reason: req.reason ?? "-",
  });

  const fetchRequests = async (status: RequestStatus) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/asset-requests`, {
        params: {
          status,
          order: "DESC",
          page: 1,
          pageSize: 20,
        },
      });

      // The API returns { data: [], metaData: {...} }
      const normalized = res.data.data.map(normalizeRequest);
      setRequests(normalized);
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to load requests",
        description: "Could not fetch asset requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const approveRequest = async (id: number) => {
    try {
      await axios.post(`${API_BASE}/asset-requests/approve/${id}`);
      toast({
        title: "Request Approved",
        description: "The asset request has been approved.",
      });
      fetchRequests(activeTab);
    } catch (err) {
      console.error(err);
      toast({
        title: "Action Failed",
        description: "Unable to approve request.",
        variant: "destructive",
      });
    }
  };

  const rejectRequest = async (id: number) => {
    try {
      await axios.post(`${API_BASE}/asset-requests/reject/${id}`);
      toast({
        title: "Request Rejected",
        description: "The asset request has been rejected.",
        variant: "destructive",
      });
      fetchRequests(activeTab);
    } catch (err) {
      console.error(err);
      toast({
        title: "Action Failed",
        description: "Unable to reject request.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="Asset Requests"
        description="Review and manage employee asset requests."
      />

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as RequestStatus)}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <p className="text-muted-foreground text-center py-12">
              Loading requests...
            </p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No requests found
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  showActions={req.status === "PENDING"}
                  onApprove={() => approveRequest(req.id)}
                  onReject={() => rejectRequest(req.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
