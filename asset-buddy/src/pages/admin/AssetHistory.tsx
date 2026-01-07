import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssetCard } from "@/components/assets/AssetCard";

/* ---------- TYPES ---------- */

interface Asset {
  id: number;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiryDate: string;
  status: string;
  condition: string;
}

interface AssetHistoryRecord {
  assignmentId: number;
  action: string;
  employee: string;
  assignedAt: string;
  endDate: string | null;
  notes: string | null;
}

/* ---------- COMPONENT ---------- */

export default function AssetHistory() {
  const [searchParams] = useSearchParams();

  // INTERNAL DB ASSET ID (example: 4)
  const assetId = searchParams.get("assetId");

  const [assetDetails, setAssetDetails] = useState<Asset | null>(null);
  const [history, setHistory] = useState<AssetHistoryRecord[]>([]);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  /* ---------- FETCH ASSET DETAILS ---------- */
  useEffect(() => {
    if (!assetId) return;

    setLoadingAsset(true);

    axios
      .get(`http://localhost:3000/assets/${assetId}`)
      .then((res) => setAssetDetails(res.data))
      .catch((err) => console.error("Failed to fetch asset", err))
      .finally(() => setLoadingAsset(false));
  }, [assetId]);

  /* ---------- FETCH ASSET HISTORY ---------- */
  useEffect(() => {
    if (!assetId) return;

    setLoadingHistory(true);

    axios
      .get(`http://localhost:3000/assets/history/${assetId}`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Failed to fetch asset history", err))
      .finally(() => setLoadingHistory(false));
  }, [assetId]);

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="Asset History"
        description="View previous assignments, ownership changes, and audit trail of assets."
      />

      {/* ---------- ASSET CARD ---------- */}
      {loadingAsset ? (
        <p className="text-muted-foreground py-6">Loading asset details...</p>
      ) : assetDetails ? (
        <AssetCard asset={assetDetails} />
      ) : (
        <p className="text-muted-foreground py-6">No asset selected</p>
      )}

      {/* ---------- HISTORY TABLE ---------- */}
      {assetId && (
        <Card className="mb-6 mt-6">
          <CardHeader>
            <CardTitle>Asset ID: {assetId}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              History of this asset
            </p>
          </CardHeader>

          <CardContent>
            {loadingHistory ? (
              <p className="text-muted-foreground py-6 text-center">
                Loading history...
              </p>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No history found
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((record) => (
                      <TableRow
                        key={record.assignmentId}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <Badge
                            variant={
                              record.action === "Assigned"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {record.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.employee}</TableCell>
                        <TableCell>
                          {new Date(record.assignedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{record.notes || "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
}
