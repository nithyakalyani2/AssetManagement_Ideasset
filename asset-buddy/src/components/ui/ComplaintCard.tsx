import { Clock, CheckCircle, AlertCircle, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Complaint } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ComplaintCardProps {
  complaint: Complaint;
  showEmployeeInfo?: boolean;
  onViewDetails?: () => void;
}

export function ComplaintCard({ complaint, showEmployeeInfo = false, onViewDetails }: ComplaintCardProps) {
  const statusConfig = {
    open: { icon: AlertCircle, variant: "pending" as const, label: "Open", color: "text-status-pending" },
    "in-progress": { icon: Clock, variant: "assigned" as const, label: "In Progress", color: "text-status-assigned" },
    resolved: { icon: CheckCircle, variant: "available" as const, label: "Resolved", color: "text-status-available" },
    closed: { icon: XCircle, variant: "secondary" as const, label: "Closed", color: "text-muted-foreground" },
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
  );
}
