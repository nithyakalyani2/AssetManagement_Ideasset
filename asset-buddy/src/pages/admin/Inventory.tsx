import { useState, useMemo } from "react";
import { Search, Plus, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { assets, Asset, AssetStatus, AssetType } from "@/lib/mockData";

export default function Inventory() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [openDialog, setOpenDialog] = useState(false);

  const generatedAssetId = useMemo(
    () =>
      `AST-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
    [openDialog]
  );

  const [newAsset, setNewAsset] = useState<Omit<Asset, "id" | "assetId">>({
    type: "Laptop",
    brand: "",
    model: "",
    status: "available",
    assignedTo: undefined,
    assignedDate: undefined,
    purchaseDate: "",
    serialNumber: "",
    condition: "New",
  });

  const assetTypes: AssetType[] = [
    "Laptop",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Mobile",
    "Headset",
    "Webcam",
    "Docking Station",
  ];

  const brands = ["Dell", "HP", "Apple", "Lenovo"];
  const modelsByBrand: Record<string, string[]> = {
    Dell: ["Latitude 5420", "XPS 13"],
    HP: ["EliteBook 840", "ProBook 450"],
    Apple: ["MacBook Air M1", "MacBook Pro M2"],
    Lenovo: ["ThinkPad T14", "ThinkPad X1"],
  };

  const filteredAssets = assets.filter((asset) => {
    const q = search.toLowerCase();
    return (
      (asset.assetId.toLowerCase().includes(q) ||
        asset.brand.toLowerCase().includes(q) ||
        asset.model.toLowerCase().includes(q) ||
        asset.assignedTo?.name.toLowerCase().includes(q)) &&
      (statusFilter === "all" || asset.status === statusFilter) &&
      (typeFilter === "all" || asset.type === typeFilter)
    );
  });

  const handleAddAsset = () => {
    const newEntry: Asset = {
      id: crypto.randomUUID(),
      assetId: generatedAssetId,
      ...newAsset,
    };

    assets.push(newEntry);
    setOpenDialog(false);
    setNewAsset({
      type: "Laptop",
      brand: "",
      model: "",
      status: "available",
      assignedTo: undefined,
      assignedDate: undefined,
      purchaseDate: "",
      serialNumber: "",
      condition: "New",
    });
  };

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="Asset Inventory"
        description={`${assets.length} total assets in the system.`}
        action={
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        }
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-8">Asset ID</label>
              <Input value={generatedAssetId} disabled />
            </div>

            <div>
              <label className="text-sm font-medium mb-8">Device Type</label>
              <Select
                value={newAsset.type}
                onValueChange={(v) =>
                  setNewAsset({ ...newAsset, type: v as AssetType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-8">Brand</label>
              <Select
                value={newAsset.brand}
                onValueChange={(v) =>
                  setNewAsset({ ...newAsset, brand: v, model: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-8">Model</label>
              <Select
                value={newAsset.model}
                onValueChange={(v) => setNewAsset({ ...newAsset, model: v })}
                disabled={!newAsset.brand}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {(modelsByBrand[newAsset.brand] || []).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-8">Serial Number</label>
              <Input
                value={newAsset.serialNumber}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, serialNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-8">Purchase Date</label>
              <Input
                type="date"
                value={newAsset.purchaseDate}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, purchaseDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-8">Status</label>
              <Select
                value={newAsset.status}
                onValueChange={(v) =>
                  setNewAsset({ ...newAsset, status: v as AssetStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="repair">Under Repair</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-8">Condition</label>
              <Select
                value={newAsset.condition}
                onValueChange={(v) =>
                  setNewAsset({
                    ...newAsset,
                    condition: v as Asset["condition"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAddAsset}>Add Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as AssetStatus | "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as AssetType | "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {assetTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
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

      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

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
                <TableRow key={asset.id}>
                  <TableCell
                    className="cursor-pointer text-primary underline"
                    onClick={() =>
                      navigate(`/admin/asset-history?assetId=${asset.assetId}`)
                    }
                  >
                    {asset.assetId}
                  </TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    {asset.brand} {asset.model}
                  </TableCell>
                  <TableCell>
                    <Badge variant={asset.status}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell>{asset.assignedTo?.name || "—"}</TableCell>
                  <TableCell>{asset.condition}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/admin/asset-history?assetId=${asset.assetId}`
                        )
                      }
                    >
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
