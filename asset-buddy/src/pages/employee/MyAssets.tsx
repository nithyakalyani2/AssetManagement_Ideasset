import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetCard } from "@/components/assets/AssetCard";
import { Button } from "@/components/ui/button";

/**
 * Types based on API response
 */
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
  createdAt: string;
  updatedAt: string;
}

interface Assignment {
  id: number;
  assignmentType: string;
  reason: string;
  returnReason: string | null;
  assignedAt: string;
  endDate: string | null;
  asset: Asset;
}

/**
 * Get logged-in user info from localStorage
 * (based on your existing auth setup)
 */
const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export default function MyAssets() {
  const currentUser = getCurrentUser();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchMyAssets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/assignments/user/${currentUser.id}`
        );
        setAssignments(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your assets");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssets();
  }, [currentUser?.id]);

  const assets = assignments.map((assignment) => assignment.asset);

  return (
    <MainLayout>
      <PageHeader
        title="My Assets"
        description={
          currentUser
            ? `Welcome back, ${currentUser.name}. Here are the assets assigned to you.`
            : "Here are your assigned assets."
        }
        action={
          <Link to="/request">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Request Asset
            </Button>
          </Link>
        }
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 text-muted-foreground">
          Loading your assets...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16 text-destructive">{error}</div>
      )}

      {/* Empty State */}
      {!loading && !error && assets.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No assets assigned
          </h3>
          <p className="text-muted-foreground mb-6">
            You don't have any assets assigned to you yet.
          </p>
          <Link to="/request">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Request Your First Asset
            </Button>
          </Link>
        </div>
      )}

      {/* Assets Grid */}
      {!loading && !error && assets.length > 0 && (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {assets.length} asset{assets.length !== 1 ? "s" : ""} assigned
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset, index) => (
              <div key={asset.id} style={{ animationDelay: `${index * 50}ms` }}>
                <AssetCard asset={asset} showFooter />
              </div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
}
