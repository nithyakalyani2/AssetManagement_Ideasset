import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Smartphone,
  Headphones,
  Camera,
  Cable,
  ArrowLeft,
  Send,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AssetType } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const assetTypes: {
  type: AssetType;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  { type: "Laptop", icon: Laptop, description: "Portable computer" },
  { type: "Monitor", icon: Monitor, description: "Display screen" },
  { type: "Keyboard", icon: Keyboard, description: "Input device" },
  { type: "Mouse", icon: Mouse, description: "Pointing device" },
  { type: "Mobile", icon: Smartphone, description: "Smartphone" },
  { type: "Headset", icon: Headphones, description: "Audio device" },
  { type: "Webcam", icon: Camera, description: "Video camera" },
  { type: "Docking Station", icon: Cable, description: "Port expander" },
];

export default function RequestAsset() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an asset type and provide a reason.",
        variant: "destructive",
      });
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Session Expired",
        description: "Please login again.",
        variant: "destructive",
      });
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/asset-requests", {
        deviceType: selectedType,
        userId: user.id,
        reason,
      });

      toast({
        title: "Request Submitted",
        description: "Your asset request has been submitted for review.",
      });

      navigate("/my-requests");
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description:
          err.response?.data?.message || "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Request an Asset"
        description="Submit a request for IT equipment. Your request will be reviewed by the IT team."
        action={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <div className="max-w-3xl">
        <div className="mb-8">
          <Label className="text-base font-medium mb-4 block">
            Select Asset Type
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {assetTypes.map(({ type, icon: Icon, description }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  selectedType === type
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{type}</span>
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-5">
            <Label className="text-base font-medium mb-4 block">
              Reason for Request
            </Label>
            <Textarea
              placeholder="Please explain why you need this asset..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
