import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Grid, List, ArrowUpDown } from "lucide-react";
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
import { Asset, AssetStatus, AssetType } from "@/lib/mockData";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export const fetchAssets = async ({
  page,
  pageSize,
  search,
  order,
}: {
  page: number;
  pageSize: number;
  search: string;
  order: "ASC" | "DESC";
}) => {
  const res = await axios.get("http://localhost:3000/assets", {
    params: {
      page,
      pageSize,
      search,
      order,
    },
  });

  return res.data;
};

export default function Inventory() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [openDialog, setOpenDialog] = useState(false);

  const [gridPage, setGridPage] = useState(1);
  const [hasMoreGrid, setHasMoreGrid] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  // table only
  // table only
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);

      const activePage = viewMode === "grid" ? gridPage : page;

      const res = await fetchAssets({
        page: activePage,
        pageSize,
        search,
        order,
      });

      const mappedAssets: Asset[] = res.data.map((a: any) => ({
        id: a.id.toString(),
        assetId: `AST-${a.id.toString().padStart(4, "0")}`,
        type: a.deviceType,
        brand: a.brand,
        model: a.model,
        serialNumber: a.serialNumber,
        purchaseDate: a.purchaseDate,
        status: a.status.toLowerCase(),
        condition: a.condition,
        assignedTo: undefined,
        assignedDate: undefined,
      }));

      if (viewMode === "grid") {
        setAssets((prev) => [...prev, ...mappedAssets]);
        setHasMoreGrid(res.metaData.hasNextPage);
      } else {
        setAssets(mappedAssets);
        setMeta(res.metaData);
      }

      setLoading(false);
    };

    loadAssets();
  }, [page, gridPage, pageSize, search, order, viewMode, refreshKey]);

  useEffect(() => {
    if (viewMode === "grid") {
      setAssets([]);
      setGridPage(1);
      setHasMoreGrid(true);
    }
  }, [search, order, viewMode, refreshKey]);

  useEffect(() => {
    if (viewMode !== "grid") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMoreGrid && !loading) {
          setGridPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    const target = document.getElementById("grid-loader");
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [hasMoreGrid, loading, viewMode]);

  const brandsByType: Record<AssetType, string[]> = {
    Laptop: [
      "Dell",
      "HP",
      "Apple",
      "Lenovo",
      "Asus",
      "Acer",
      "MSI",
      "Microsoft",
      "LG",
    ],

    Monitor: ["Dell", "HP", "LG", "Samsung", "Acer"],

    Keyboard: ["Logitech", "Dell", "HP", "Zebronics", "Portronics"],

    Mouse: ["Logitech", "Dell", "HP", "Zebronics", "Portronics"],

    Mobile: ["Apple", "Samsung", "OnePlus", "Xiaomi"],

    Headset: ["Logitech", "JBL", "Sony", "Zebronics"],

    Webcam: ["Logitech", "Dell", "HP"],

    "Docking Station": ["Dell", "HP", "Lenovo"],
  };

  const modelsByBrand: Record<string, string[]> = {
    // 🔹 Laptop brands
    Dell: [
      "Latitude 5420",
      "Latitude 7430",
      "XPS 13",
      "XPS 15",
      "Inspiron 15 3520",
    ],

    HP: ["EliteBook 840", "EliteBook 860 G9", "ProBook 450", "Pavilion 14"],

    Apple: [
      "MacBook Air M1",
      "MacBook Air M2",
      "MacBook Pro M1",
      "MacBook Pro M2",
      "iPhone 14",
      "iPhone 15",
    ],

    Lenovo: ["ThinkPad T14", "ThinkPad X1 Carbon", "ThinkPad E14"],

    Asus: ["VivoBook 15", "ZenBook 14", "ROG Strix G15"],

    Acer: ["Aspire 5", "Swift 3", "Predator Helios 300"],

    MSI: ["Modern 14", "GF63 Thin"],

    Microsoft: ["Surface Laptop 5", "Surface Pro 9"],

    LG: ["Gram 14", "Gram 16"],

    // 🔹 Accessories
    Logitech: ["MX Master 3", "MX Keys", "K380 Keyboard", "C920 Webcam"],

    Zebronics: [
      "Zeb-Transformer Keyboard",
      "Zeb-Dash Mouse",
      "Zeb-Thunder Headset",
    ],

    Portronics: ["Toad Mouse", "Hydra Keyboard"],

    Samsung: ["Galaxy S23", "Galaxy Book Pro"],

    Sony: ["WH-1000XM5"],

    JBL: ["Quantum 200"],

    OnePlus: ["OnePlus 11"],

    Xiaomi: ["Redmi Note 13"],
  };

  const displayedAssets = assets;

  const handleAddAsset = async () => {
    try {
      const payload = {
        deviceType: newAsset.type,
        brand: newAsset.brand,
        model: newAsset.model,
        serialNumber: newAsset.serialNumber,
        purchaseDate: newAsset.purchaseDate,
        warrantyExpiryDate: newAsset.purchaseDate, // later you can auto +1 year
        status:
          newAsset.status === "available"
            ? "Available"
            : newAsset.status === "repair"
            ? "Under Repair"
            : "Retired",
        condition: newAsset.condition,
      };

      const res = await axios.post("http://localhost:3000/assets", payload);

      toast({
        title: "Asset Added",
        description: `${newAsset.brand} ${newAsset.model} has been added successfully.`,
      });

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

      setRefreshKey((k) => k + 1);
      if (viewMode === "grid") {
        setAssets([]);
        setGridPage(1);
        setHasMoreGrid(true);
      } else {
        setPage(1);
      }
    } catch (error) {
      console.error("Failed to add asset", error);

      toast({
        title: "Failed to add asset",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const pageSizeOptions = [1, 5, 10, 20, 50, 100];

  const getRangeText = () => {
    if (!meta) return "";

    const start = (meta.page - 1) * meta.pageSize + 1;
    const end = Math.min(meta.page * meta.pageSize, meta.itemCount);

    return `${start}–${end} of ${meta.itemCount}`;
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
              <label className="text-sm font-medium mb-1 block">
                Device Type
              </label>
              <Select
                value={newAsset.type}
                onValueChange={(v) =>
                  setNewAsset({
                    ...newAsset,
                    type: v as AssetType,
                    brand: "",
                    model: "",
                  })
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
              <label className="text-sm font-medium mb-1 block">Brand</label>
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
                  {(brandsByType[newAsset.type] || []).map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Model</label>
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
              <label className="text-sm font-medium mb-1 block">
                Serial Number
              </label>
              <Input
                value={newAsset.serialNumber}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, serialNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Purchase Date
              </label>

              <Input
                type="date"
                value={newAsset.purchaseDate}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, purchaseDate: e.target.value })
                }
                className="
                      bg-background
                      text-foreground
                      border border-input
                      rounded-md
                      h-10
                      px-3
                      [&::-webkit-calendar-picker-indicator]:opacity-70
                      [&::-webkit-calendar-picker-indicator]:cursor-pointer
                    "
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
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
              <label className="text-sm font-medium mb-1 block">
                Condition
              </label>
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>

          {hasMoreGrid && (
            <div
              id="grid-loader"
              className="h-10 flex justify-center items-center text-muted-foreground"
            >
              Loading more...
            </div>
          )}
        </>
      )}

      {viewMode === "list" && (
        <div className="border rounded-lg overflow-hidden pb-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  className="cursor-pointer"
                  onClick={() => setOrder(order === "ASC" ? "DESC" : "ASC")}
                >
                  Asset ID
                  <ArrowUpDown className="inline ml-2 w-4 h-4 text-muted-foreground" />
                </TableHead>

                <TableHead>Type</TableHead>
                <TableHead>Brand / Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell
                    className="cursor-pointer text-primary underline"
                    onClick={() =>
                      navigate(
                        `/admin/asset-history?assetId=${asset.id}`,
                        { state: { id: asset.id } }
                      )
                    }
                  >
                    {asset.assetId}
                  </TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    {asset.brand} {asset.model}
                  </TableCell>
                  <TableCell>
                    <Badge variant={asset.status as any}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {
                      // asset?.assignedTo ||
                      "—"
                    }
                  </TableCell>
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

          {viewMode === "list" && meta && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 px-2">
              {/* Rows per page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page
                </span>

                <Select
                  value={pageSize.toString()}
                  onValueChange={(v) => {
                    const newSize = Number(v);
                    setPageSize(newSize);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Range text */}
              <span className="text-sm text-muted-foreground">
                {getRangeText()}
              </span>

              {/* Prev / Next */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasPreviousPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}
