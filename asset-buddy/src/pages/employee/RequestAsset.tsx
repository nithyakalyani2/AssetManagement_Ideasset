import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [priority, setPriority] = useState<string>("Medium");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!selectedType || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an asset type and provide a reason.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request Submitted",
      description: "Your asset request has been submitted for review.",
    });

    navigate("/my-requests");
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
        {/* Asset Type Selection */}
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
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
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

        {/* Priority Selection */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <Label className="text-base font-medium mb-4 block">
              Priority Level
            </Label>
            <RadioGroup
              value={priority}
              onValueChange={setPriority}
              className="flex gap-4"
            >
              {["Low", "Medium", "High"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={level} />
                  <Label htmlFor={level} className="cursor-pointer">
                    {level}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Reason */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <Label
              htmlFor="reason"
              className="text-base font-medium mb-4 block"
            >
              Reason for Request
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you need this asset..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Provide a clear justification to help IT prioritize your request.
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Submit Request
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
