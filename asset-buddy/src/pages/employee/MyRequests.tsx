import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RequestCard } from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RequestStatus = "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";

interface AssetRequest {
  id: number;
  deviceType: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = "http://localhost:3000";

export default function MyRequests() {
  const [requests, setRequests] = useState<AssetRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = Number(localStorage.getItem("userId"));

  const fetchMyRequests = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/asset-requests/user/${userId}`, {
        params: {
          order: "DESC",
          page: 1,
          pageSize: 20,
        },
      });

      // backend may return array OR { data: [] }
      setRequests(res.data.data ?? res.data);
    } catch (err) {
      console.error("Failed to fetch my requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const pendingRequests = requests.filter((r) => r.status === "PENDING");

  const completedRequests = requests.filter((r) => r.status !== "PENDING");

  return (
    <MainLayout>
      <PageHeader
        title="My Requests"
        description="Track the status of your asset requests."
        action={
          <Link to="/request">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        }
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {loading ? (
            <p className="text-muted-foreground text-center py-12">
              Loading requests...
            </p>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No pending requests</p>
              <Link to="/request">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create a Request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {loading ? (
            <p className="text-muted-foreground text-center py-12">
              Loading requests...
            </p>
          ) : completedRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No completed requests yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
