import { Package, CheckCircle, Wrench, Archive, Clock, Users, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/assets/StatCard";
import { AssetCard } from "@/components/assets/AssetCard";
import { RequestCard } from "@/components/requests/RequestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assets, assetRequests } from "@/lib/mockData";

const API_BASE = "http://localhost:3000";

// Interface for asset summary API response
interface AssetSummary {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  underRepairAssets: number;
  retiredAssets: number;
}

export default function AdminDashboard() {
  // Fetch asset summary from API
  const { data: assetSummary, isLoading: summaryLoading, error: summaryError } = useQuery<AssetSummary>({
    queryKey: ["assetSummary"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/assets/summary`);
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 60000, // Refetch every minute
  });

  // Use API data or fallback to defaults
  const totalAssets = assetSummary?.totalAssets ?? 0;
  const availableAssets = assetSummary?.availableAssets ?? 0;
  const assignedAssets = assetSummary?.assignedAssets ?? 0;
  const repairAssets = assetSummary?.underRepairAssets ?? 0;
  const retiredAssets = assetSummary?.retiredAssets ?? 0;

  const pendingRequests = assetRequests.filter((r) => r.status === "pending");
  const recentAssets = assets.slice(0, 4);

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="IT Asset Dashboard"
        description="Overview of all IT assets and pending requests."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Assets"
          value={summaryLoading ? "..." : totalAssets}
          icon={Package}
          trend={{ value: 12, positive: true }}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Available"
          value={summaryLoading ? "..." : availableAssets}
          icon={CheckCircle}
          iconClassName="bg-status-available-bg text-status-available"
        />
        <StatCard
          title="Assigned"
          value={summaryLoading ? "..." : assignedAssets}
          icon={Users}
          iconClassName="bg-status-assigned-bg text-status-assigned"
        />
        <StatCard
          title="Under Repair"
          value={summaryLoading ? "..." : repairAssets}
          icon={Wrench}
          iconClassName="bg-status-repair-bg text-status-repair"
        />
        <StatCard
          title="Retired"
          value={summaryLoading ? "..." : retiredAssets}
          icon={Archive}
          iconClassName="bg-muted text-muted-foreground"
        />
      </div>

      {/* Error Message */}
      {summaryError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive">
            Failed to load asset summary. Using cached or default values.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-status-pending" />
              Pending Requests
            </CardTitle>
            <Link to="/admin/requests">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending requests
              </p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((request) => (
                  <RequestCard key={request.id} request={request} showActions />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Asset Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Laptops", count: assets.filter((a) => a.type === "Laptop").length },
              { label: "Monitors", count: assets.filter((a) => a.type === "Monitor").length },
              { label: "Keyboards", count: assets.filter((a) => a.type === "Keyboard").length },
              { label: "Mice", count: assets.filter((a) => a.type === "Mouse").length },
              { label: "Mobiles", count: assets.filter((a) => a.type === "Mobile").length },
              { label: "Other", count: assets.filter((a) => !["Laptop", "Monitor", "Keyboard", "Mouse", "Mobile"].includes(a.type)).length },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Assets */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Recent Assets</CardTitle>
          <Link to="/admin/inventory">
            <Button variant="ghost" size="sm">View Inventory</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
