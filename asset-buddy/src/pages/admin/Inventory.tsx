import { useState } from "react";
import { Search, Filter, Plus, Grid, List } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetCard } from "@/components/assets/AssetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { assets, AssetStatus, AssetType } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetId.toLowerCase().includes(search.toLowerCase()) ||
      asset.brand.toLowerCase().includes(search.toLowerCase()) ||
      asset.model.toLowerCase().includes(search.toLowerCase()) ||
      asset.assignedTo?.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    const matchesType = typeFilter === "all" || asset.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const assetTypes: AssetType[] = ["Laptop", "Monitor", "Keyboard", "Mouse", "Mobile", "Headset", "Webcam", "Docking Station"];

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="Asset Inventory"
        description={`${assets.length} total assets in the system.`}
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, brand, model, or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AssetStatus | "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="repair">Under Repair</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AssetType | "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {assetTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredAssets.length} of {assets.length} assets
      </p>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Asset ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Brand / Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{asset.assetId}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    {asset.brand} {asset.model}
                  </TableCell>
                  <TableCell>
                    <Badge variant={asset.status}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {asset.assignedTo?.name || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{asset.condition}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </MainLayout>
  );
}
