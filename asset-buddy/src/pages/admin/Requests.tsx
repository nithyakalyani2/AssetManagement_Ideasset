import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RequestCard } from "@/components/requests/RequestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { assetRequests, AssetRequest } from "@/lib/mockData";

export default function Requests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AssetRequest[]>(assetRequests);

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "approved" as const,
              reviewedBy: "IT Admin",
              reviewedDate: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    toast({
      title: "Request Approved",
      description: "The asset request has been approved.",
    });
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "rejected" as const,
              reviewedBy: "IT Admin",
              reviewedDate: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    toast({
      title: "Request Rejected",
      description: "The asset request has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="Asset Requests"
        description="Review and manage employee asset requests."
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  showActions
                  onApprove={() => handleApprove(request.id)}
                  onReject={() => handleReject(request.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No approved requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rejected requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
