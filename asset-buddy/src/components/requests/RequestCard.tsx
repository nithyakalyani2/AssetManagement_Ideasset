import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: {
    id: number;
    deviceType?: string;
    reason?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | string;
    createdAt?: string;
    updatedAt?: string;
    user?: {
      id?: number;
      name?: string;
      email?: string;
    } | null;
    assignedAssetId?: number | null;
    assignedUser?: { id?: number; name?: string } | null;
  };
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export function RequestCard({
  request,
  showActions = false,
  onApprove,
  onReject,
}: RequestCardProps) {
  // Map status (API may return uppercase)
  const statusConfig = {
    pending: { icon: Clock, variant: "pending" as const, label: "Pending" },
    approved: {
      icon: CheckCircle,
      variant: "available" as const,
      label: "Approved",
    },
    rejected: {
      icon: XCircle,
      variant: "destructive" as const,
      label: "Rejected",
    },
  };

  // Normalize status to lowercase and fallback
  const statusKey = request.status?.toLowerCase() as keyof typeof statusConfig;
  const {
    icon: StatusIcon,
    variant,
    label,
  } = statusConfig[statusKey] ?? {
    icon: AlertCircle,
    variant: "destructive" as const,
    label: "Unknown",
  };

  // Safe user name
  const userName = request.user?.name || "Unknown User";
  const assignedName = request.assignedUser?.name || null;

  return (
    <Card className="animate-fade-in transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-foreground">{userName}</h4>
              <p className="text-xs text-muted-foreground">
                {assignedName || "Employee"}
              </p>
            </div>
          </div>
          <Badge variant={variant}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {label}
          </Badge>
        </div>

        {/* Request Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Requested Asset</span>
            <span className="text-sm text-muted-foreground">
              {request.deviceType || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Priority</span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-md font-medium",
                "bg-status-assigned-bg text-status-assigned" // fallback
              )}
            >
              Medium
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Request Date</span>
            <span className="text-sm text-muted-foreground">
              {request.createdAt
                ? new Date(request.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {request.reason || "-"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && request.status === "PENDING" && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button size="sm" className="flex-1" onClick={onApprove}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={onReject}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {/* Reviewed Info */}
        {assignedName && (
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            Reviewed by {assignedName} on{" "}
            {request.updatedAt
              ? new Date(request.updatedAt).toLocaleDateString()
              : "-"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
