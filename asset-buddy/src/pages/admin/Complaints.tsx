import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComplaintCard } from "@/components/ui/ComplaintCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Complaint, ComplaintCategory, ComplaintStatus } from "@/lib/mockData";
import { employeeApis, AssetReplacementResponse } from "@/api/employeeApis";

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
        employeeId: item.user?.id?.toString() || "unknown",
        employeeName: item.user?.name || "Unknown User",
        employeeDepartment: item.user?.role || "Unknown",
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

export default function AdminComplaints() {
    const { toast } = useToast();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [rawData, setRawData] = useState<AssetReplacementResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Rejection dialog state
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectingComplaintId, setRejectingComplaintId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const fetchComplaints = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await employeeApis.getAllAssetReplacements();
            setRawData(response);
            const mappedComplaints = response.map(mapApiResponseToComplaint);
            setComplaints(mappedComplaints);
        } catch (err) {
            console.error("Failed to fetch complaints:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch complaints");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Filter by original API status
    const pendingComplaints = rawData.filter((r) => r.status === "pending");
    const approvedComplaints = rawData.filter((r) => r.status === "approved");
    const rejectedComplaints = rawData.filter((r) => r.status === "rejected");

    // Get mapped complaints for display
    const pendingComplaintsMapped = pendingComplaints.map(mapApiResponseToComplaint);
    const approvedComplaintsMapped = approvedComplaints.map(mapApiResponseToComplaint);
    const rejectedComplaintsMapped = rejectedComplaints.map(mapApiResponseToComplaint);

    const handleApprove = async (complaintId: string) => {
        setIsProcessing(true);
        try {
            await employeeApis.updateAssetReplacementStatus(
                parseInt(complaintId, 10),
                "approved"
            );

            // Refresh the list
            await fetchComplaints();

            toast({
                title: "Complaint Resolved",
                description: "The complaint has been marked as resolved.",
            });
        } catch (err) {
            console.error("Failed to resolve complaint:", err);
            toast({
                title: "Failed to Resolve",
                description: err instanceof Error ? err.message : "Failed to resolve the complaint. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const openRejectDialog = (complaintId: string) => {
        setRejectingComplaintId(complaintId);
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

    const handleReject = async () => {
        if (!rejectingComplaintId) return;

        if (!rejectionReason.trim()) {
            toast({
                title: "Reason Required",
                description: "Please provide a reason for rejecting this complaint.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        try {
            await employeeApis.updateAssetReplacementStatus(
                parseInt(rejectingComplaintId, 10),
                "rejected",
                rejectionReason.trim()
            );

            // Refresh the list
            await fetchComplaints();

            toast({
                title: "Complaint Rejected",
                description: "The complaint has been rejected.",
                variant: "destructive",
            });

            // Close dialog and reset state
            setRejectDialogOpen(false);
            setRejectingComplaintId(null);
            setRejectionReason("");
        } catch (err) {
            console.error("Failed to reject complaint:", err);
            toast({
                title: "Failed to Reject",
                description: err instanceof Error ? err.message : "Failed to reject the complaint. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <MainLayout isAdmin>
                <PageHeader
                    title="Employee Complaints"
                    description="Review and manage employee complaints and issues."
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
            <MainLayout isAdmin>
                <PageHeader
                    title="Employee Complaints"
                    description="Review and manage employee complaints and issues."
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
        <MainLayout isAdmin>
            <PageHeader
                title="Employee Complaints"
                description="Review and manage employee complaints and issues."
            />

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="pending" className="relative">
                        Pending
                        {pendingComplaints.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                                {pendingComplaints.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Resolved ({approvedComplaints.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        Rejected ({rejectedComplaints.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    {pendingComplaintsMapped.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No pending complaints</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingComplaintsMapped.map((complaint) => (
                                <div key={complaint.id} className="space-y-0">
                                    <ComplaintCard
                                        complaint={complaint}
                                        showEmployeeInfo
                                    />
                                    {/* Action buttons integrated into card */}
                                    <div className="flex gap-2 px-4 py-3 bg-muted/50 rounded-b-lg border border-t-0 -mt-2">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleApprove(complaint.id)}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Resolve"
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => openRejectDialog(complaint.id)}
                                            disabled={isProcessing}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="approved">
                    {approvedComplaintsMapped.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No resolved complaints</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {approvedComplaintsMapped.map((complaint) => (
                                <ComplaintCard
                                    key={complaint.id}
                                    complaint={complaint}
                                    showEmployeeInfo
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="rejected">
                    {rejectedComplaintsMapped.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No rejected complaints</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rejectedComplaintsMapped.map((complaint) => (
                                <ComplaintCard
                                    key={complaint.id}
                                    complaint={complaint}
                                    showEmployeeInfo
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Rejection Reason Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Complaint</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this complaint. This will be shared with the employee.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejection-reason">Rejection Reason</Label>
                            <Textarea
                                id="rejection-reason"
                                placeholder="Enter the reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setRejectDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isProcessing || !rejectionReason.trim()}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Rejecting...
                                </>
                            ) : (
                                "Reject Complaint"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
