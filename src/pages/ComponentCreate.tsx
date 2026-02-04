import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import {
  ComponentType,
  FibreType,
  FabricConstruction,
  DyeMethod,
  FibreComposition,
  componentTypeConfig,
  fibreTypeConfig,
  constructionConfig,
  dyeMethodConfig,
} from "@/types/component";

type WizardStep = "type" | "details" | "composition" | "sustainability" | "review";

const STEPS: { id: WizardStep; label: string; description: string }[] = [
  { id: "type", label: "Component Type", description: "Select fabric or trim" },
  { id: "details", label: "Details", description: "Basic information" },
  { id: "composition", label: "Composition", description: "Fibre breakdown" },
  { id: "sustainability", label: "Sustainability", description: "Compliance flags" },
  { id: "review", label: "Review", description: "Confirm and create" },
];

const MILLS = [
  "Arvind Mills",
  "Vardhman Textiles",
  "Raymond Ltd",
  "Bombay Dyeing",
  "Welspun India",
  "Trident Group",
];

const COUNTRIES = [
  "India",
  "Bangladesh",
  "Vietnam",
  "China",
  "Turkey",
  "Pakistan",
  "Indonesia",
];

const TRIM_TYPES = [
  "Button",
  "Zipper",
  "Label",
  "Thread",
  "Elastic",
  "Drawcord",
  "Snap",
  "Hook & Eye",
  "Velcro",
  "Ribbon",
];

interface FormData {
  componentType: ComponentType | "";
  mill: string;
  tuReference: string;
  countryOfOrigin: string;
  // Fabric specific
  composition: FibreComposition[];
  construction: FabricConstruction | "";
  weight: number;
  width: number;
  dyeMethod: DyeMethod | "";
  colour: string;
  // Trim specific
  trimType: string;
  trimColour: string;
  trimSize: string;
  trimMaterial: string;
  // Sustainability
  isSustainable: boolean;
  isRegenerative: boolean;
  reachCompliant: boolean;
}

const initialFormData: FormData = {
  componentType: "",
  mill: "",
  tuReference: "",
  countryOfOrigin: "",
  composition: [],
  construction: "",
  weight: 150,
  width: 150,
  dyeMethod: "",
  colour: "",
  trimType: "",
  trimColour: "",
  trimSize: "",
  trimMaterial: "",
  isSustainable: false,
  isRegenerative: false,
  reachCompliant: true,
};

export default function ComponentCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>("type");
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addFibreComposition = () => {
    const newFibre: FibreComposition = {
      id: crypto.randomUUID(),
      fibreType: "cotton",
      fibreLabel: "Cotton",
      percentage: 0,
      isSustainable: false,
      isRecycled: false,
    };
    updateFormData("composition", [...formData.composition, newFibre]);
  };

  const updateFibreComposition = (id: string, updates: Partial<FibreComposition>) => {
    updateFormData(
      "composition",
      formData.composition.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const removeFibreComposition = (id: string) => {
    updateFormData(
      "composition",
      formData.composition.filter((f) => f.id !== id)
    );
  };

  const totalComposition = formData.composition.reduce((sum, f) => sum + f.percentage, 0);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "type":
        return formData.componentType !== "";
      case "details":
        if (formData.componentType === "fabric") {
          return !!(formData.mill && formData.tuReference && formData.countryOfOrigin && formData.construction && formData.dyeMethod);
        }
        return !!(formData.mill && formData.tuReference && formData.countryOfOrigin && formData.trimType);
      case "composition":
        if (formData.componentType === "trim") return true;
        return totalComposition === 100;
      case "sustainability":
        return true;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const idx = currentStepIndex;
    // Skip composition step for trims
    if (currentStep === "details" && formData.componentType === "trim") {
      setCurrentStep("sustainability");
      return;
    }
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1].id);
    }
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    // Skip composition step for trims
    if (currentStep === "sustainability" && formData.componentType === "trim") {
      setCurrentStep("details");
      return;
    }
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1].id);
    }
  };

  const handleSubmit = () => {
    toast.success("Component created successfully!", {
      description: `${formData.componentType === "fabric" ? "Fabric" : "Trim"} ${formData.tuReference} has been added.`,
    });
    navigate("/components");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "type":
        return <TypeStep formData={formData} updateFormData={updateFormData} />;
      case "details":
        return <DetailsStep formData={formData} updateFormData={updateFormData} />;
      case "composition":
        return (
          <CompositionStep
            formData={formData}
            totalComposition={totalComposition}
            addFibreComposition={addFibreComposition}
            updateFibreComposition={updateFibreComposition}
            removeFibreComposition={removeFibreComposition}
          />
        );
      case "sustainability":
        return <SustainabilityStep formData={formData} updateFormData={updateFormData} />;
      case "review":
        return <ReviewStep formData={formData} totalComposition={totalComposition} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/components")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Component</h1>
            <p className="text-muted-foreground">Add a new fabric or trim to the library</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{STEPS[currentStepIndex].label}</span>
            <span className="text-muted-foreground">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {STEPS.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-center gap-1 text-xs ${
                  idx <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    idx < currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : idx === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx < currentStepIndex ? <Check className="h-3 w-3" /> : idx + 1}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStepIndex].label}</CardTitle>
            <CardDescription>{STEPS[currentStepIndex].description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStepIndex === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep === "review" ? (
            <Button onClick={handleSubmit} disabled={!canProceed()}>
              <Check className="h-4 w-4 mr-2" />
              Create Component
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Step Components
function TypeStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {(Object.entries(componentTypeConfig) as [ComponentType, { label: string; icon: string }][]).map(
        ([type, config]) => (
          <Card
            key={type}
            className={`cursor-pointer transition-all hover:border-primary ${
              formData.componentType === type ? "border-primary bg-primary/5 ring-2 ring-primary" : ""
            }`}
            onClick={() => updateFormData("componentType", type)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{config.icon}</div>
              <h3 className="font-semibold text-lg">{config.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {type === "fabric"
                  ? "Main body materials, linings, and interlinings"
                  : "Buttons, zippers, labels, and accessories"}
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}

function DetailsStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  const isFabric = formData.componentType === "fabric";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Common Fields */}
      <div className="space-y-2">
        <Label htmlFor="tuReference">TU Reference *</Label>
        <Input
          id="tuReference"
          placeholder="e.g., FAB-2024-001"
          value={formData.tuReference}
          onChange={(e) => updateFormData("tuReference", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mill">Mill / Supplier *</Label>
        <Select value={formData.mill} onValueChange={(v) => updateFormData("mill", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select mill" />
          </SelectTrigger>
          <SelectContent>
            {MILLS.map((mill) => (
              <SelectItem key={mill} value={mill}>
                {mill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country of Origin *</Label>
        <Select
          value={formData.countryOfOrigin}
          onValueChange={(v) => updateFormData("countryOfOrigin", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fabric-specific fields */}
      {isFabric && (
        <>
          <div className="space-y-2">
            <Label htmlFor="construction">Construction *</Label>
            <Select
              value={formData.construction}
              onValueChange={(v) => updateFormData("construction", v as FabricConstruction)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select construction" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(constructionConfig) as [FabricConstruction, { label: string; type: string }][]).map(
                  ([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label} ({config.type})
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dyeMethod">Dye Method *</Label>
            <Select
              value={formData.dyeMethod}
              onValueChange={(v) => updateFormData("dyeMethod", v as DyeMethod)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dye method" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(dyeMethodConfig) as [DyeMethod, { label: string }][]).map(
                  ([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Weight (g/m²): {formData.weight}</Label>
            <Slider
              value={[formData.weight]}
              onValueChange={([v]) => updateFormData("weight", v)}
              min={50}
              max={500}
              step={10}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50 g/m²</span>
              <span>500 g/m²</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Width (cm): {formData.width}</Label>
            <Slider
              value={[formData.width]}
              onValueChange={([v]) => updateFormData("width", v)}
              min={90}
              max={300}
              step={5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>90 cm</span>
              <span>300 cm</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="colour">Colour</Label>
            <Input
              id="colour"
              placeholder="e.g., Navy Blue"
              value={formData.colour}
              onChange={(e) => updateFormData("colour", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Trim-specific fields */}
      {!isFabric && (
        <>
          <div className="space-y-2">
            <Label htmlFor="trimType">Trim Type *</Label>
            <Select value={formData.trimType} onValueChange={(v) => updateFormData("trimType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select trim type" />
              </SelectTrigger>
              <SelectContent>
                {TRIM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trimColour">Colour *</Label>
            <Input
              id="trimColour"
              placeholder="e.g., Silver"
              value={formData.trimColour}
              onChange={(e) => updateFormData("trimColour", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trimSize">Size</Label>
            <Input
              id="trimSize"
              placeholder="e.g., 15mm"
              value={formData.trimSize}
              onChange={(e) => updateFormData("trimSize", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trimMaterial">Material</Label>
            <Input
              id="trimMaterial"
              placeholder="e.g., Metal, Plastic"
              value={formData.trimMaterial}
              onChange={(e) => updateFormData("trimMaterial", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}

function CompositionStep({
  formData,
  totalComposition,
  addFibreComposition,
  updateFibreComposition,
  removeFibreComposition,
}: {
  formData: FormData;
  totalComposition: number;
  addFibreComposition: () => void;
  updateFibreComposition: (id: string, updates: Partial<FibreComposition>) => void;
  removeFibreComposition: (id: string) => void;
}) {
  const isValid = totalComposition === 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Fibre Composition</h3>
          <p className="text-sm text-muted-foreground">
            Total must equal 100%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isValid ? "default" : "destructive"}>
            {totalComposition}% / 100%
          </Badge>
          {isValid && <Check className="h-4 w-4 text-green-600" />}
          {!isValid && totalComposition > 0 && <X className="h-4 w-4 text-destructive" />}
        </div>
      </div>

      {/* Composition Progress Bar */}
      <div className="h-3 bg-muted rounded-full overflow-hidden flex">
        {formData.composition.map((fibre, idx) => {
          const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-orange-500",
          ];
          return (
            <div
              key={fibre.id}
              className={`${colors[idx % colors.length]} transition-all`}
              style={{ width: `${fibre.percentage}%` }}
              title={`${fibre.fibreLabel}: ${fibre.percentage}%`}
            />
          );
        })}
      </div>

      {/* Fibre List */}
      <div className="space-y-4">
        {formData.composition.map((fibre) => (
          <Card key={fibre.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Fibre Type</Label>
                <Select
                  value={fibre.fibreType}
                  onValueChange={(v) => {
                    const config = fibreTypeConfig[v as FibreType];
                    updateFibreComposition(fibre.id, {
                      fibreType: v as FibreType,
                      fibreLabel: config.label,
                      isSustainable: config.isSustainable,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(fibreTypeConfig) as [FibreType, { label: string; isSustainable: boolean; category: string }][]).map(
                      ([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                          {config.isSustainable && " ♻️"}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Percentage: {fibre.percentage}%</Label>
                <Slider
                  value={[fibre.percentage]}
                  onValueChange={([v]) => updateFibreComposition(fibre.id, { percentage: v })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`recycled-${fibre.id}`}
                    checked={fibre.isRecycled}
                    onCheckedChange={(v) => updateFibreComposition(fibre.id, { isRecycled: v })}
                  />
                  <Label htmlFor={`recycled-${fibre.id}`} className="text-sm">
                    Recycled
                  </Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFibreComposition(fibre.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addFibreComposition} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Fibre
      </Button>
    </div>
  );
}

function SustainabilityStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Sustainable Material</Label>
              <p className="text-sm text-muted-foreground">
                This component contains sustainable or eco-friendly materials
              </p>
            </div>
            <Switch
              checked={formData.isSustainable}
              onCheckedChange={(v) => updateFormData("isSustainable", v)}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Regenerative</Label>
              <p className="text-sm text-muted-foreground">
                Sourced from regenerative agriculture or manufacturing processes
              </p>
            </div>
            <Switch
              checked={formData.isRegenerative}
              onCheckedChange={(v) => updateFormData("isRegenerative", v)}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">REACH Compliant</Label>
              <p className="text-sm text-muted-foreground">
                Complies with EU REACH regulation for chemical substances
              </p>
            </div>
            <Switch
              checked={formData.reachCompliant}
              onCheckedChange={(v) => updateFormData("reachCompliant", v)}
            />
          </div>
        </Card>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-2">
        {formData.isSustainable && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ♻️ Sustainable
          </Badge>
        )}
        {formData.isRegenerative && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            🌱 Regenerative
          </Badge>
        )}
        {formData.reachCompliant && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            ✓ REACH Compliant
          </Badge>
        )}
      </div>
    </div>
  );
}

function ReviewStep({
  formData,
  totalComposition,
}: {
  formData: FormData;
  totalComposition: number;
}) {
  const isFabric = formData.componentType === "fabric";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="p-4">
          <h4 className="font-medium mb-3">Basic Information</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="font-medium">
                {formData.componentType === "fabric" ? "🧵 Fabric" : "🔘 Trim"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">TU Reference</dt>
              <dd className="font-medium">{formData.tuReference || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Mill</dt>
              <dd className="font-medium">{formData.mill || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Country</dt>
              <dd className="font-medium">{formData.countryOfOrigin || "-"}</dd>
            </div>
          </dl>
        </Card>

        {/* Technical Details */}
        <Card className="p-4">
          <h4 className="font-medium mb-3">
            {isFabric ? "Fabric Details" : "Trim Details"}
          </h4>
          <dl className="space-y-2 text-sm">
            {isFabric ? (
              <>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Construction</dt>
                  <dd className="font-medium">
                    {formData.construction ? constructionConfig[formData.construction]?.label : "-"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dye Method</dt>
                  <dd className="font-medium">
                    {formData.dyeMethod ? dyeMethodConfig[formData.dyeMethod]?.label : "-"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="font-medium">{formData.weight} g/m²</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Width</dt>
                  <dd className="font-medium">{formData.width} cm</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Colour</dt>
                  <dd className="font-medium">{formData.colour || "-"}</dd>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Trim Type</dt>
                  <dd className="font-medium">{formData.trimType || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Colour</dt>
                  <dd className="font-medium">{formData.trimColour || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="font-medium">{formData.trimSize || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Material</dt>
                  <dd className="font-medium">{formData.trimMaterial || "-"}</dd>
                </div>
              </>
            )}
          </dl>
        </Card>

        {/* Composition (Fabric only) */}
        {isFabric && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">Composition ({totalComposition}%)</h4>
            <div className="space-y-2">
              {formData.composition.length === 0 ? (
                <p className="text-sm text-muted-foreground">No fibres added</p>
              ) : (
                formData.composition.map((fibre) => (
                  <div key={fibre.id} className="flex justify-between text-sm">
                    <span>
                      {fibre.fibreLabel}
                      {fibre.isRecycled && " (Recycled)"}
                    </span>
                    <span className="font-medium">{fibre.percentage}%</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Sustainability */}
        <Card className="p-4">
          <h4 className="font-medium mb-3">Sustainability</h4>
          <div className="flex flex-wrap gap-2">
            {formData.isSustainable ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ♻️ Sustainable
              </Badge>
            ) : (
              <Badge variant="outline">Not Sustainable</Badge>
            )}
            {formData.isRegenerative && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                🌱 Regenerative
              </Badge>
            )}
            {formData.reachCompliant ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ✓ REACH Compliant
              </Badge>
            ) : (
              <Badge variant="destructive">Not REACH Compliant</Badge>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
