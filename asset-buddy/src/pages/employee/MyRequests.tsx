import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { RequestCard } from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assetRequests, currentEmployee } from "@/lib/mockData";

export default function MyRequests() {
  const myRequests = assetRequests.filter(
    (req) => req.requesterId === currentEmployee.id
  );

  const pendingRequests = myRequests.filter((r) => r.status === "pending");
  const completedRequests = myRequests.filter((r) => r.status !== "pending");

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
          {pendingRequests.length === 0 ? (
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
          {completedRequests.length === 0 ? (
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
