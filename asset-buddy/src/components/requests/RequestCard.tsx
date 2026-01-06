import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetRequest } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: AssetRequest;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export function RequestCard({ request, showActions = false, onApprove, onReject }: RequestCardProps) {
  const statusConfig = {
    pending: { icon: Clock, variant: "pending" as const, label: "Pending" },
    approved: { icon: CheckCircle, variant: "available" as const, label: "Approved" },
    rejected: { icon: XCircle, variant: "destructive" as const, label: "Rejected" },
  };

  const priorityConfig = {
    Low: "bg-muted text-muted-foreground",
    Medium: "bg-status-assigned-bg text-status-assigned",
    High: "bg-status-repair-bg text-status-repair",
  };

  const { icon: StatusIcon, variant, label } = statusConfig[request.status];

  return (
    <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">
                {request.requesterName.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-foreground">{request.requesterName}</h4>
              <p className="text-xs text-muted-foreground">{request.requesterDepartment}</p>
            </div>
          </div>
          <Badge variant={variant}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {label}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Requested Asset</span>
            <span className="text-sm text-muted-foreground">{request.assetType}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Priority</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-md font-medium", priorityConfig[request.priority])}>
              {request.priority}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Request Date</span>
            <span className="text-sm text-muted-foreground">
              {new Date(request.requestDate).toLocaleDateString()}
            </span>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">{request.reason}</p>
          </div>
        </div>

        {showActions && request.status === "pending" && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button size="sm" className="flex-1" onClick={onApprove}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={onReject}>
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {request.reviewedDate && (
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            Reviewed by {request.reviewedBy} on {new Date(request.reviewedDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
