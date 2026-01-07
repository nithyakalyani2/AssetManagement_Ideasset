import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Laptop, Wifi, Key, HelpCircle, Monitor, ImagePlus, X, Loader2 } from "lucide-react";
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
import { employeeApis } from "@/api/employeeApis";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myAssets = assets.filter(asset => asset.assignedTo?.id === currentEmployee.id);

  // Image upload state and handlers
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPG, JPEG, and PNG files are allowed.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedImages(prev => [...prev, file]);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Helper function to extract numeric ID from employee ID (e.g., "EMP001" -> 1)
  const extractNumericId = (id: string): number => {
    const numericPart = id.replace(/\D/g, '');
    return parseInt(numericPart, 10) || 0;
  };

  // Helper function to get asset's numeric ID from assetId string
  const getAssetNumericId = (assetIdString: string): number => {
    const asset = myAssets.find(a => a.assetId === assetIdString);
    if (asset) {
      // Extract numeric part from asset.id (which is a string like "1", "2", etc.)
      return parseInt(asset.id, 10) || 0;
    }
    return 0;
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!selectedCategory) {
      toast({
        title: "Missing Information",
        description: "Please select an issue category.",
        variant: "destructive",
      });
      return;
    }

    if (!relatedAsset || relatedAsset === "none") {
      toast({
        title: "Missing Information",
        description: "Please select a related asset. This field is required.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !description.trim()) {
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

    setIsSubmitting(true);

    try {
      await employeeApis.submitAssetReplacement({
        userId: extractNumericId(currentEmployee.id),
        currentAssetId: getAssetNumericId(relatedAsset),
        category: selectedCategory,
        subject: subject.trim(),
        description: description.trim(),
        priority: priority.toLowerCase(),
        image: uploadedImages.length > 0 ? uploadedImages[0] : undefined,
      });

      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted. We'll get back to you soon.",
      });

      navigate("/my-complaints");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Image (Optional)</CardTitle>
            <CardDescription>Attach screenshots or photos related to the issue (JPG, JPEG, PNG - Max 5MB)</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200 flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <ImagePlus className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload an image</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, JPEG, PNG up to 5MB</p>
              </div>
            </div>

            {/* Preview uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
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

        {/* Related Asset - Required */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Related Asset <span className="text-destructive">*</span></CardTitle>
            <CardDescription>Select the device related to this issue</CardDescription>
          </CardHeader>
          <CardContent>
            {myAssets.length > 0 ? (
              <Select value={relatedAsset} onValueChange={setRelatedAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {myAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.assetId}>
                      {asset.assetId} - {asset.brand} {asset.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">No assets assigned to you. Please contact IT support.</p>
            )}
          </CardContent>
        </Card>

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
          <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Complaint
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}