import { Laptop, Monitor, Keyboard, Mouse, Smartphone, Headphones, Camera, Cable } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Asset, AssetType } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const assetIcons: Record<AssetType, React.ComponentType<{ className?: string }>> = {
  Laptop: Laptop,
  Monitor: Monitor,
  Keyboard: Keyboard,
  Mouse: Mouse,
  Mobile: Smartphone,
  Headset: Headphones,
  Webcam: Camera,
  "Docking Station": Cable,
};

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
  compact?: boolean;
}

export function AssetCard({ asset, onClick, compact = false }: AssetCardProps) {
  const Icon = assetIcons[asset.type] || Laptop;

  const statusVariant = {
    available: "available",
    assigned: "assigned",
    repair: "repair",
    retired: "retired",
  }[asset.status] as "available" | "assigned" | "repair" | "retired";

  if (compact) {
    return (
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20",
          onClick && "hover:scale-[1.02]"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{asset.brand} {asset.model}</span>
                <Badge variant={statusVariant} className="shrink-0">{asset.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{asset.assetId} • {asset.type}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md hover:border-primary/20 animate-fade-in",
        onClick && "cursor-pointer hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          <Badge variant={statusVariant}>{asset.status}</Badge>
        </div>
        
        <h3 className="font-semibold text-foreground mb-1">{asset.brand} {asset.model}</h3>
        <p className="text-sm text-muted-foreground mb-4">{asset.type}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Asset ID</span>
            <span className="font-medium">{asset.assetId}</span>
          </div>
          {asset.assignedTo && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned to</span>
              <span className="font-medium">{asset.assignedTo.name}</span>
            </div>
          )}
          {asset.assignedDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Since</span>
              <span className="font-medium">{new Date(asset.assignedDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Condition</span>
            <span className="font-medium">{asset.condition}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
