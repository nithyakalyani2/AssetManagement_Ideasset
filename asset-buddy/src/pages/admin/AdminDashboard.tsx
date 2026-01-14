import {
  Package,
  CheckCircle,
  Wrench,
  Archive,
  Clock,
  Users,
  TrendingUpDown,
  AlertCircle,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "axios";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/assets/StatCard";
import { AssetCard } from "@/components/assets/AssetCard";
import { RequestCard } from "@/components/requests/RequestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assets as mockAssets } from "@/lib/mockData";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API_BASE = "http://localhost:3000";

interface AssetSummary {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  underRepairAssets: number;
  retiredAssets: number;
}

interface ForecastResponse {
  deviceType: string;
  forecasts: {
    threeMonths: { predictedCount: number };
    sixMonths: { predictedCount: number };
    twelveMonths: { predictedCount: number };
  };
}

interface Asset {
  id: number;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: string;
  assignedTo?: { id: number; name: string; email: string } | null;
  assignedAt?: string | null;
  createdAt: string;
}

interface AssetRequest {
  id: number;
  deviceType: string;
  reason: string;
  status: string;
  assignedAssetId: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  assignedUser: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export default function AdminDashboard() {
  const [deviceType, setDeviceType] = useState("laptop");
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [predict, setPredict] = useState(false);

  const {
    data: assetSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery<AssetSummary>({
    queryKey: ["assetSummary"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/assets/summary`);
      return res.data;
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });

  const {
    data: forecastData,
    isLoading: forecastLoading,
    refetch: refetchForecast,
  } = useQuery<ForecastResponse>({
    queryKey: ["assetForecast", deviceType],
    queryFn: async () => {
      const res = await axios.get(
        `${API_BASE}/ai/forecast-asset-needs/${deviceType}`
      );
      return res.data;
    },
    enabled: false,
    staleTime: 0,
  });

  const { data: pendingRequests = [] } = useQuery<AssetRequest[]>({
    queryKey: ["pendingRequests"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/asset-requests`, {
        params: {
          status: "PENDING",
          order: "ASC",
          page: 1,
          pageSize: 20,
        },
      });
      return res.data.data;
    },
    staleTime: 30000,
  });

  useEffect(() => {
    async function fetchRecentAssets() {
      const res = await axios.get(`${API_BASE}/assets`, {
        params: { order: "ASC", page: 1, pageSize: 20 },
      });
      const sorted = res.data.data
        .sort(
          (a: Asset, b: Asset) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 4);
      setRecentAssets(sorted);
    }
    fetchRecentAssets();
  }, []);

  useEffect(() => {
    setPredict(false);
  }, [deviceType]);

  const handlePredict = async () => {
    setPredict(true);
    await refetchForecast();
  };

  const totalAssets = assetSummary?.totalAssets ?? 0;
  const availableAssets = assetSummary?.availableAssets ?? 0;
  const assignedAssets = assetSummary?.assignedAssets ?? 0;
  const repairAssets = assetSummary?.underRepairAssets ?? 0;
  const retiredAssets = assetSummary?.retiredAssets ?? 0;

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="IT Asset Dashboard"
        description="Overview of all IT assets and pending requests."
      />

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

      {summaryError && (
        <div className="mb-6 p-4 bg-destructive/10 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive">
            Failed to load asset summary.
          </p>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader className="flex flex-col pb-4">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUpDown className="w-5 h-5 text-status-assigned" />
              Asset Forecast
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Based on recent trends, IT asset demand is projected to grow by
            nearly 15% over the next year — plan procurement accordingly.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex gap-4 justify-center mb-4">
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="monitor">Monitor</SelectItem>
                <SelectItem value="keyboard">Keyboard</SelectItem>
                <SelectItem value="mouse">Mouse</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="headset">Headset</SelectItem>
                <SelectItem value="webcam">Webcam</SelectItem>
                <SelectItem value="docking station">Docking Station</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handlePredict}>Predict</Button>
          </div>

          {predict && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Next 3 Months"
                value={
                  forecastLoading
                    ? "..."
                    : forecastData?.forecasts.threeMonths.predictedCount
                }
                icon={Calendar}
              />
              <StatCard
                title="Next 6 Months"
                value={
                  forecastLoading
                    ? "..."
                    : forecastData?.forecasts.sixMonths.predictedCount
                }
                icon={CalendarDays}
              />
              <StatCard
                title="Next 12 Months"
                value={
                  forecastLoading
                    ? "..."
                    : forecastData?.forecasts.twelveMonths.predictedCount
                }
                icon={CalendarRange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-status-pending" />
              Pending Requests
            </CardTitle>
            <Link to="/admin/requests">
              <Button variant="ghost" size="sm">
                View All
              </Button>
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
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Asset Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Laptop", "Monitor", "Keyboard", "Mouse", "Mobile"].map(
              (type) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{type}s</span>
                  <span className="text-sm font-medium">
                    {mockAssets.filter((a) => a.type === type).length}
                  </span>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Recent Assets</CardTitle>
          <Link to="/admin/inventory">
            <Button variant="ghost" size="sm">
              View Inventory
            </Button>
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
