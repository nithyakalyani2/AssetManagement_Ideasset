import { useState, useEffect } from "react";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComplaintCard } from "@/components/ui/ComplaintCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employeeApis, AssetReplacementResponse } from "@/api/employeeApis";
import { Complaint, ComplaintCategory, ComplaintStatus, currentEmployee } from "@/lib/mockData";

// Map API response to the Complaint interface used by ComplaintCard
const mapApiResponseToComplaint = (item: AssetReplacementResponse): Complaint => {
  // Map API status to ComplaintStatus
  const statusMap: Record<string, ComplaintStatus> = {
    pending: "open",
    approved: "resolved",
    rejected: "rejected",
    "in-progress": "in-progress",
    open: "open",
    resolved: "resolved",
    closed: "closed",
  };

  // Map API priority to expected format
  const priorityMap: Record<string, "Low" | "Medium" | "High"> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    Low: "Low",
    Medium: "Medium",
    High: "High",
  };

  // Validate category or default to "Other"
  const validCategories: ComplaintCategory[] = [
    "Hardware Issue",
    "Software Issue",
    "Network Issue",
    "Access Issue",
    "Other",
  ];
  const category = validCategories.includes(item.category as ComplaintCategory)
    ? (item.category as ComplaintCategory)
    : "Other";

  return {
    id: item.id.toString(),
    employeeId: item.user?.id?.toString() || currentEmployee.id,
    employeeName: item.user?.name || currentEmployee.name,
    employeeDepartment: item.user?.role || currentEmployee.department,
    category,
    subject: item.subject || "No Subject",
    description: item.description || "",
    relatedAssetId: item.currentAsset?.id?.toString(),
    priority: priorityMap[item.priority] || "Medium",
    status: statusMap[item.status] || "open",
    createdDate: item.createdAt,
    updatedDate: item.updatedAt,
    attachedImages: item.imageUrl ? [`http://localhost:3000/asset-replacements/file/${item.imageUrl}`] : undefined,
  };
};

// Helper function to extract numeric ID from employee ID (e.g., "EMP001" -> 1)
const extractNumericId = (id: string): number => {
  const numericPart = id.replace(/\D/g, '');
  return parseInt(numericPart, 10) || 1;
};

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = extractNumericId(currentEmployee.id);
        const response = await employeeApis.getMyComplaints(userId);
        const mappedComplaints = response.map(mapApiResponseToComplaint);
        setComplaints(mappedComplaints);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch complaints");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const openComplaints = complaints.filter(
    (c) => c.status === "open" || c.status === "in-progress"
  );
  const closedComplaints = complaints.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  );

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader
          title="My Complaints"
          description="Track and manage your IT complaints and issues."
        />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading complaints...</span>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
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
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to load complaints</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

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

      {complaints.length === 0 ? (
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
                New Complaint
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
                <p className="text-muted-foreground">No active complaints</p>
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

