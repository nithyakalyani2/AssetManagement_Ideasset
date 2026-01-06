import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetCard } from "@/components/assets/AssetCard";
import { Button } from "@/components/ui/button";
import { assets, currentEmployee } from "@/lib/mockData";

export default function MyAssets() {
  const myAssets = assets.filter(
    (asset) => asset.assignedTo?.id === currentEmployee.id
  );

  return (
    <MainLayout>
      <PageHeader
        title="My Assets"
        description={`Welcome back, ${currentEmployee.name}. Here are the assets assigned to you.`}
        action={
          <Link to="/request">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Request Asset
            </Button>
          </Link>
        }
      />

      {myAssets.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No assets assigned</h3>
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
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {myAssets.length} asset{myAssets.length !== 1 ? "s" : ""} assigned
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAssets.map((asset, index) => (
              <div
                key={asset.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AssetCard asset={asset} />
              </div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
}
