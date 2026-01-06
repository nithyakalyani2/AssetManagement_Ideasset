import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, AlertTriangle, Laptop, Wifi, Key, HelpCircle, Monitor } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { assets, currentEmployee, ComplaintCategory } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const categories: { type: ComplaintCategory; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { type: "Hardware Issue", icon: Laptop, description: "Device problems" },
  { type: "Software Issue", icon: Monitor, description: "App or system issues" },
  { type: "Network Issue", icon: Wifi, description: "Connectivity problems" },
  { type: "Access Issue", icon: Key, description: "Permission problems" },
  { type: "Other", icon: HelpCircle, description: "Other IT issues" },
];

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("Medium");
  const [relatedAsset, setRelatedAsset] = useState<string>("");

  const myAssets = assets.filter(asset => asset.assignedTo?.id === currentEmployee.id);

  const handleSubmit = () => {
    if (!selectedCategory || !subject.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (subject.length > 100) {
      toast({
        title: "Subject too long",
        description: "Subject must be less than 100 characters.",
        variant: "destructive",
      });
      return;
    }

    if (description.length > 1000) {
      toast({
        title: "Description too long",
        description: "Description must be less than 1000 characters.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been submitted. We'll get back to you soon.",
    });

    navigate("/my-complaints");
  };

  return (
    <MainLayout>
      <PageHeader
        title="Submit a Complaint"
        description="Report an IT issue or problem. Our team will investigate and respond promptly."
        action={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <div className="max-w-3xl space-y-6">
        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Issue Category</CardTitle>
            <CardDescription>Select the type of issue you're experiencing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map(({ type, icon: Icon, description }) => (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    selectedCategory === type
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    selectedCategory === type ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{type}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject</CardTitle>
            <CardDescription>Briefly describe the issue (max 100 characters)</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., Laptop screen flickering"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-2">{subject.length}/100 characters</p>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
            <CardDescription>Provide details about the issue (max 1000 characters)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Please describe the issue in detail. Include any error messages, when it started, and steps to reproduce..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">{description.length}/1000 characters</p>
          </CardContent>
        </Card>

        {/* Related Asset */}
        {myAssets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Asset (Optional)</CardTitle>
              <CardDescription>If this issue is related to a specific device</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={relatedAsset} onValueChange={setRelatedAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific asset</SelectItem>
                  {myAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.assetId}>
                      {asset.assetId} - {asset.brand} {asset.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Priority Level</CardTitle>
            <CardDescription>How urgent is this issue?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={priority} onValueChange={setPriority} className="flex gap-4">
              {[
                { level: "Low", desc: "Minor inconvenience" },
                { level: "Medium", desc: "Affects productivity" },
                { level: "High", desc: "Cannot work" },
              ].map(({ level, desc }) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={level} />
                  <Label htmlFor={level} className="cursor-pointer">
                    <span className="font-medium">{level}</span>
                    <span className="text-xs text-muted-foreground ml-1">({desc})</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Submit Complaint
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
