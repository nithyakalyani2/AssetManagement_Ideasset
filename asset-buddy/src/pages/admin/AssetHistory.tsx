import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
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
import { assetHistory } from "@/lib/mockData";
import axios from "axios";
import { AssetCard } from "@/components/assets/AssetCard";

export default function AssetHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [AssetDetails, setAssetDetails] = useState();

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    searchParams.get("assetId")
  );

  const filteredHistory = selectedAssetId
    ? assetHistory.filter((record) => record.assetId === selectedAssetId)
    : [];

  useEffect(() => {
    axios
      .get("http://localhost:3000/assets/" + state?.id)
      .then((res) => {
        setAssetDetails(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="Asset History"
        description="View previous assignments, ownership changes, and audit trail of assets."
      />
      <AssetCard key={state.id} asset={AssetDetails} />
      {selectedAssetId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Asset ID: {selectedAssetId}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              History of this asset
            </p>
          </CardHeader>
          <CardContent>
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
                {filteredHistory.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge
                      // variant={
                      //   record.action === "Assigned"
                      //     ? "primary"
                      //     : record.action === "Returned"
                      //     ? "secondary"
                      //     : record.action === "Repair"
                      //     ? "destructive"
                      //     : "muted"
                      // }
                      >
                        {record.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.employeeName || "—"}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.notes || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
}
