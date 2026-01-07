import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, XCircle, ArrowRight, Image, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Complaint } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ComplaintCardProps {
  complaint: Complaint;
  showEmployeeInfo?: boolean;
  onViewDetails?: () => void;
}

export function ComplaintCard({ complaint, showEmployeeInfo = false, onViewDetails }: ComplaintCardProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState(false);

  // Fetch images as blobs when dialog opens (to bypass Content-Disposition: attachment)
  useEffect(() => {
    if (isImageDialogOpen && complaint.attachedImages && complaint.attachedImages.length > 0) {
      const fetchImages = async () => {
        setLoadingImages(true);
        const urls: Record<string, string> = {};

        for (const imageUrl of complaint.attachedImages!) {
          try {
            const response = await fetch(imageUrl);
            if (response.ok) {
              const blob = await response.blob();
              urls[imageUrl] = URL.createObjectURL(blob);
            }
          } catch (error) {
            console.error("Failed to fetch image:", imageUrl, error);
            setFailedImages(prev => new Set(prev).add(imageUrl));
          }
        }

        setBlobUrls(urls);
        setLoadingImages(false);
      };

      fetchImages();
    }

    // Cleanup blob URLs when dialog closes
    return () => {
      Object.values(blobUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [isImageDialogOpen, complaint.attachedImages]);

  // Track which images failed to load
  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl));
  };

  // Download image using the original URL
  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `attachment-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter out images that failed to load for attachment check
  const validAttachments = complaint.attachedImages?.filter(img => !failedImages.has(img)) || [];
  const hasAttachments = complaint.attachedImages && complaint.attachedImages.length > 0;

  const statusConfig = {
    open: { icon: AlertCircle, variant: "pending" as const, label: "Open", color: "text-status-pending" },
    "in-progress": { icon: Clock, variant: "assigned" as const, label: "In Progress", color: "text-status-assigned" },
    resolved: { icon: CheckCircle, variant: "available" as const, label: "Resolved", color: "text-status-available" },
    closed: { icon: XCircle, variant: "secondary" as const, label: "Closed", color: "text-muted-foreground" },
    rejected: { icon: XCircle, variant: "destructive" as const, label: "Rejected", color: "text-destructive" },
  };

  const priorityConfig = {
    Low: "bg-muted text-muted-foreground",
    Medium: "bg-status-assigned-bg text-status-assigned",
    High: "bg-status-repair-bg text-status-repair",
  };

  const categoryConfig = {
    "Hardware Issue": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Software Issue": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Network Issue": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Access Issue": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Other": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  const { icon: StatusIcon, variant, label, color } = statusConfig[complaint.status];

  return (
    <>
      <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={cn("text-xs", categoryConfig[complaint.category])}>
                  {complaint.category}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", priorityConfig[complaint.priority])}>
                  {complaint.priority}
                </Badge>
              </div>
              <h4 className="font-medium text-foreground line-clamp-1">{complaint.subject}</h4>
            </div>
            <Badge variant={variant}>
              <StatusIcon className={cn("w-3 h-3 mr-1", color)} />
              {label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {showEmployeeInfo && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-muted-foreground text-xs">
                    {complaint.employeeName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{complaint.employeeName}</p>
                  <p className="text-xs text-muted-foreground">{complaint.employeeDepartment}</p>
                </div>
              </div>
              <Separator className="mb-3" />
            </>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {complaint.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Created: {new Date(complaint.createdDate).toLocaleDateString()}</span>
            {complaint.assignedTo && (
              <span>Assigned: {complaint.assignedTo}</span>
            )}
          </div>

          {complaint.resolution && (
            <>
              <Separator className="my-3" />
              <div className="bg-status-available-bg/50 rounded-lg p-3">
                <p className="text-xs font-medium text-status-available mb-1">Resolution</p>
                <p className="text-sm text-foreground">{complaint.resolution}</p>
              </div>
            </>
          )}

          {/* View Attachment Button */}
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasAttachments}
              onClick={() => setIsImageDialogOpen(true)}
              className={cn(
                "text-xs",
                hasAttachments
                  ? "text-primary hover:text-primary"
                  : "text-muted-foreground cursor-not-allowed"
              )}
            >
              <Image className="w-4 h-4 mr-1" />
              View Attachment{validAttachments.length > 1 ? 's' : ''}
              {hasAttachments && ` (${validAttachments.length})`}
            </Button>
          </div>
        </CardContent>

        {onViewDetails && (
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full" onClick={onViewDetails}>
              View Details
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Image Popup Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attached Images</DialogTitle>
          </DialogHeader>
          {loadingImages ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading images...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {complaint.attachedImages?.map((imageUrl, index) => (
                <div key={index} className="rounded-lg overflow-hidden border relative group">
                  {failedImages.has(imageUrl) ? (
                    <div className="w-full h-48 bg-muted flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mb-2" />
                      <p className="text-sm">Image not available</p>
                    </div>
                  ) : blobUrls[imageUrl] ? (
                    <>
                      <img
                        src={blobUrls[imageUrl]}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      {/* Download button overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => handleDownload(imageUrl, index)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}