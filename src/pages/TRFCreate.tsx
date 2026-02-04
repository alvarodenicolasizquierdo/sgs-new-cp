import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Package,
  Building2,
  FlaskConical,
  ClipboardCheck,
  Save,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TestingLevel, testingLevelConfig } from "@/types/trf";
import { TRFTestingLevelBadge } from "@/components/trf/TRFTestingLevelBadge";

interface WizardStep {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const steps: WizardStep[] = [
  {
    id: "basic",
    title: "Basic Information",
    icon: FileText,
    description: "TRF details and priority",
  },
  {
    id: "product",
    title: "Product Details",
    icon: Package,
    description: "Product and sample information",
  },
  {
    id: "supplier",
    title: "Supplier & Lab",
    icon: Building2,
    description: "Select supplier and testing lab",
  },
  {
    id: "testing",
    title: "Testing Requirements",
    icon: FlaskConical,
    description: "Select required tests",
  },
  {
    id: "review",
    title: "Review & Submit",
    icon: ClipboardCheck,
    description: "Review and submit TRF",
  },
];

const testTypes = [
  { id: "physical", label: "Physical Testing", description: "Tensile strength, tear resistance, abrasion" },
  { id: "chemical", label: "Chemical Testing", description: "Restricted substances, pH, formaldehyde" },
  { id: "flammability", label: "Flammability", description: "Flame resistance, burn rate testing" },
  { id: "colorfastness", label: "Colorfastness", description: "Light, wash, rubbing fastness" },
  { id: "dimensional", label: "Dimensional Stability", description: "Shrinkage, stretch recovery" },
  { id: "performance", label: "Performance Testing", description: "Durability, pilling, snagging" },
];

const suppliers = [
  { id: "s1", name: "SafeGuard Manufacturing" },
  { id: "s2", name: "TextilePro Inc" },
  { id: "s3", name: "BlueThread Textiles" },
  { id: "s4", name: "SportStep Ltd" },
  { id: "s5", name: "TinyTots Apparel" },
];

const labs = [
  { id: "l1", name: "SGS Hong Kong", location: "Hong Kong" },
  { id: "l2", name: "SGS Shanghai", location: "Shanghai" },
  { id: "l3", name: "SGS Vietnam", location: "Ho Chi Minh City" },
];

const TRFCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    priority: "normal",
    testingLevel: "" as TestingLevel | "",
    dueDate: "",
    notes: "",
    // Product
    productName: "",
    productCode: "",
    category: "",
    sampleDescription: "",
    // Supplier & Lab
    supplierId: "",
    labId: "",
    // Testing
    testTypes: [] as string[],
    specialInstructions: "",
  });

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTestType = (testId: string) => {
    setFormData((prev) => ({
      ...prev,
      testTypes: prev.testTypes.includes(testId)
        ? prev.testTypes.filter((t) => t !== testId)
        : [...prev.testTypes, testId],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.priority && formData.testingLevel && formData.dueDate;
      case 1:
        return formData.productName && formData.productCode;
      case 2:
        return formData.supplierId && formData.labId;
      case 3:
        return formData.testTypes.length > 0;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting TRF:", formData);
    navigate("/tests");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => updateFormData("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testingLevel">Testing Level *</Label>
                <Select
                  value={formData.testingLevel}
                  onValueChange={(value) => updateFormData("testingLevel", value as TestingLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select testing level" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(testingLevelConfig) as TestingLevel[]).map((level) => (
                      <SelectItem key={level} value={level}>
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full", testingLevelConfig[level].bgColor)} />
                          <span>{testingLevelConfig[level].label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.testingLevel && (
                  <p className="text-xs text-muted-foreground">
                    {testingLevelConfig[formData.testingLevel].description}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Target Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateFormData("dueDate", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or notes..."
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Cotton Blend T-Shirt"
                  value={formData.productName}
                  onChange={(e) => updateFormData("productName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productCode">Product Code *</Label>
                <Input
                  id="productCode"
                  placeholder="e.g., PRD-CT-001"
                  value={formData.productCode}
                  onChange={(e) => updateFormData("productCode", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Product Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateFormData("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="home-textiles">Home Textiles</SelectItem>
                  <SelectItem value="outdoor">Outdoor Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sampleDescription">Sample Description</Label>
              <Textarea
                id="sampleDescription"
                placeholder="Describe the sample (color, size, material composition)..."
                value={formData.sampleDescription}
                onChange={(e) => updateFormData("sampleDescription", e.target.value)}
                rows={3}
              />
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Upload Product Images</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Supplier *</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) => updateFormData("supplierId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Testing Laboratory *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {labs.map((lab) => (
                  <Card
                    key={lab.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      formData.labId === lab.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-muted-foreground"
                    )}
                    onClick={() => updateFormData("labId", lab.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lab.name}</p>
                          <p className="text-sm text-muted-foreground">{lab.location}</p>
                        </div>
                        {formData.labId === lab.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="mb-4 block">Select Required Tests *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testTypes.map((test) => (
                  <Card
                    key={test.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      formData.testTypes.includes(test.id)
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-muted-foreground"
                    )}
                    onClick={() => toggleTestType(test.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.testTypes.includes(test.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{test.label}</p>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any specific testing requirements or standards..."
                value={formData.specialInstructions}
                onChange={(e) => updateFormData("specialInstructions", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId);
        const selectedLab = labs.find((l) => l.id === formData.labId);
        const selectedTests = testTypes.filter((t) => formData.testTypes.includes(t.id));

        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <p className="font-medium capitalize">{formData.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Testing Level</p>
                  {formData.testingLevel ? (
                    <TRFTestingLevelBadge level={formData.testingLevel} size="md" />
                  ) : (
                    <p className="font-medium">-</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {formData.dueDate
                      ? new Date(formData.dueDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product Name</p>
                  <p className="font-medium">{formData.productName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product Code</p>
                  <p className="font-medium">{formData.productCode || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supplier & Lab</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{selectedSupplier?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Testing Lab</p>
                  <p className="font-medium">{selectedLab?.name || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Testing Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedTests.map((test) => (
                    <Badge key={test.id} variant="secondary">
                      {test.label}
                    </Badge>
                  ))}
                  {selectedTests.length === 0 && (
                    <p className="text-muted-foreground">No tests selected</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tests")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New TRF</h1>
          <p className="text-muted-foreground">
            Submit a new test request form
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2",
                    index < steps.length - 1 && "flex-1"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                      isCompleted && "bg-success text-success-foreground",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-4",
                        isCompleted ? "bg-success" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep + 1} of {steps.length}: {currentStepData.description}
          </p>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentStepData.icon className="h-5 w-5 text-primary" />
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2">
              <Check className="h-4 w-4" />
              Submit TRF
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TRFCreate;
