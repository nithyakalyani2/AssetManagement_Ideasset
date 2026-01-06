import { useState } from "react";
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

  const filteredAssets = assets.filter((asset) => {
    const q = search.toLowerCase();

    const matchesSearch =
      asset.assetId.toLowerCase().includes(q) ||
      asset.brand.toLowerCase().includes(q) ||
      asset.model.toLowerCase().includes(q) ||
      asset.assignedTo?.name.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || asset.status === statusFilter;

    const matchesType = typeFilter === "all" || asset.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddAsset = () => {
    const assetId = `AST-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    const newEntry: Asset = {
      id: crypto.randomUUID(),
      assetId,
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Asset ID</label>
              <Input value="Auto Generated" disabled />
            </div>

            <div>
              <label className="text-sm font-medium">Device Type</label>
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
              <label className="text-sm font-medium">Brand</label>
              <Input
                value={newAsset.brand}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, brand: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Model</label>
              <Input
                value={newAsset.model}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, model: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Serial Number</label>
              <Input
                value={newAsset.serialNumber}
                onChange={(e) =>
                  setNewAsset({
                    ...newAsset,
                    serialNumber: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
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
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Purchase Date</label>
              <Input
                type="date"
                value={newAsset.purchaseDate}
                onChange={(e) =>
                  setNewAsset({
                    ...newAsset,
                    purchaseDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Condition</label>
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
                  <SelectItem value="Fair">Fair</SelectItem>
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
