    import { Plus, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComplaintCard } from "@/components/ui/ComplaintCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { complaints, currentEmployee } from "@/lib/mockData";

export default function MyComplaints() {
  const myComplaints = complaints.filter(
    (complaint) => complaint.employeeId === currentEmployee.id
  );

  const openComplaints = myComplaints.filter(
    (c) => c.status === "open" || c.status === "in-progress"
  );
  const closedComplaints = myComplaints.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  );

  return (
    <MainLayout>
      <PageHeader
        title="My Complaints"
        description="Track and manage your IT complaints and issues."
        action={
          <Link to="/submit-complaint">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          </Link>
        }
      />

      {myComplaints.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No complaints</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              You haven't submitted any complaints yet. If you're experiencing any IT issues, let us know.
            </p>
            <Link to="/submit-complaint">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Submit a Complaint
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active ({openComplaints.length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Resolved ({closedComplaints.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {openComplaints.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No active complaints</p>
                <Link to="/submit-complaint">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit a Complaint
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed">
            {closedComplaints.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resolved complaints</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {closedComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </MainLayout>
  );
}
