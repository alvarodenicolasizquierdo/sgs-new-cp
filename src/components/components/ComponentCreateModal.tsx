import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { addComponent } from "@/data/mockComponents";

type WizardStep = "type" | "details" | "composition" | "sustainability" | "review";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: "type", label: "Type" },
  { id: "details", label: "Details" },
  { id: "composition", label: "Composition" },
  { id: "sustainability", label: "Sustainability" },
  { id: "review", label: "Review" },
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
  composition: FibreComposition[];
  construction: FabricConstruction | "";
  weight: number;
  width: number;
  dyeMethod: DyeMethod | "";
  colour: string;
  trimType: string;
  trimColour: string;
  trimSize: string;
  trimMaterial: string;
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

interface ComponentCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComponentCreated?: (componentId: string) => void;
}

export function ComponentCreateModal({ 
  open, 
  onOpenChange, 
  onComponentCreated 
}: ComponentCreateModalProps) {
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
      case "review":
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep === "details" && formData.componentType === "trim") {
      setCurrentStep("sustainability");
      return;
    }
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStep === "sustainability" && formData.componentType === "trim") {
      setCurrentStep("details");
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    const newComponentId = crypto.randomUUID();
    const now = new Date().toISOString().split("T")[0];
    
    // Create the component object based on type
    if (formData.componentType === "fabric") {
      const newFabric = {
        id: newComponentId,
        componentType: "fabric" as const,
        mill: formData.mill,
        tuReference: formData.tuReference,
        countryOfOrigin: formData.countryOfOrigin,
        isSustainable: formData.isSustainable,
        isRegenerative: formData.isRegenerative,
        reachCompliant: formData.reachCompliant,
        status: "pending" as const,
        composition: formData.composition,
        construction: formData.construction as FabricConstruction,
        weight: formData.weight,
        width: formData.width,
        dyeMethod: formData.dyeMethod as DyeMethod,
        colour: formData.colour,
        createdAt: now,
        updatedAt: now,
        createdBy: "current-user",
      };
      addComponent(newFabric);
    } else {
      const newTrim = {
        id: newComponentId,
        componentType: "trim" as const,
        mill: formData.mill,
        tuReference: formData.tuReference,
        countryOfOrigin: formData.countryOfOrigin,
        isSustainable: formData.isSustainable,
        isRegenerative: formData.isRegenerative,
        reachCompliant: formData.reachCompliant,
        status: "pending" as const,
        trimType: formData.trimType,
        colour: formData.trimColour,
        size: formData.trimSize,
        material: formData.trimMaterial,
        createdAt: now,
        updatedAt: now,
        createdBy: "current-user",
      };
      addComponent(newTrim);
    }
    
    toast.success("Component created successfully!", {
      description: `${formData.componentType === "fabric" ? "Fabric" : "Trim"} ${formData.tuReference} has been added.`,
    });
    
    // Reset form and close modal
    setFormData(initialFormData);
    setCurrentStep("type");
    onOpenChange(false);
    onComponentCreated?.(newComponentId);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setCurrentStep("type");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Component</DialogTitle>
          <DialogDescription>
            Add a new fabric or trim to link with your style
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2 px-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{STEPS[currentStepIndex].label}</span>
            <span className="text-muted-foreground">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {/* Type Step */}
            {currentStep === "type" && (
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
                        <h3 className="font-semibold">{config.label}</h3>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            )}

            {/* Details Step */}
            {currentStep === "details" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>TU Reference *</Label>
                  <Input
                    placeholder="e.g., FAB-2024-001"
                    value={formData.tuReference}
                    onChange={(e) => updateFormData("tuReference", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mill / Supplier *</Label>
                  <Select value={formData.mill} onValueChange={(v) => updateFormData("mill", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mill" />
                    </SelectTrigger>
                    <SelectContent>
                      {MILLS.map((mill) => (
                        <SelectItem key={mill} value={mill}>{mill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Country of Origin *</Label>
                  <Select value={formData.countryOfOrigin} onValueChange={(v) => updateFormData("countryOfOrigin", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.componentType === "fabric" && (
                  <>
                    <div className="space-y-2">
                      <Label>Construction *</Label>
                      <Select value={formData.construction} onValueChange={(v) => updateFormData("construction", v as FabricConstruction)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select construction" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(constructionConfig) as [FabricConstruction, { label: string }][]).map(
                            ([key, config]) => (
                              <SelectItem key={key} value={key}>{config.label}</SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Dye Method *</Label>
                      <Select value={formData.dyeMethod} onValueChange={(v) => updateFormData("dyeMethod", v as DyeMethod)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dye method" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(dyeMethodConfig) as [DyeMethod, { label: string }][]).map(
                            ([key, config]) => (
                              <SelectItem key={key} value={key}>{config.label}</SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Colour</Label>
                      <Input
                        placeholder="e.g., Navy Blue"
                        value={formData.colour}
                        onChange={(e) => updateFormData("colour", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {formData.componentType === "trim" && (
                  <>
                    <div className="space-y-2">
                      <Label>Trim Type *</Label>
                      <Select value={formData.trimType} onValueChange={(v) => updateFormData("trimType", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trim type" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRIM_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Colour</Label>
                      <Input
                        placeholder="e.g., Silver"
                        value={formData.trimColour}
                        onChange={(e) => updateFormData("trimColour", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Composition Step (fabric only) */}
            {currentStep === "composition" && formData.componentType === "fabric" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Fibre Composition</Label>
                  <Badge variant={totalComposition === 100 ? "default" : "destructive"}>
                    Total: {totalComposition}%
                  </Badge>
                </div>
                
                {formData.composition.map((fibre) => (
                  <div key={fibre.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Select
                      value={fibre.fibreType}
                      onValueChange={(v) => {
                        const config = fibreTypeConfig[v as FibreType];
                        updateFibreComposition(fibre.id, { 
                          fibreType: v as FibreType,
                          fibreLabel: config?.label || v 
                        });
                      }}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(fibreTypeConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex-1">
                      <Slider
                        value={[fibre.percentage]}
                        onValueChange={([v]) => updateFibreComposition(fibre.id, { percentage: v })}
                        max={100}
                        step={1}
                      />
                    </div>
                    <span className="w-12 text-right font-mono">{fibre.percentage}%</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFibreComposition(fibre.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addFibreComposition} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fibre
                </Button>
              </div>
            )}

            {/* Sustainability Step */}
            {currentStep === "sustainability" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Sustainable Material</Label>
                    <p className="text-sm text-muted-foreground">Certified recycled or organic</p>
                  </div>
                  <Switch
                    checked={formData.isSustainable}
                    onCheckedChange={(v) => updateFormData("isSustainable", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Regenerative Sourcing</Label>
                    <p className="text-sm text-muted-foreground">From regenerative agriculture</p>
                  </div>
                  <Switch
                    checked={formData.isRegenerative}
                    onCheckedChange={(v) => updateFormData("isRegenerative", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>REACH Compliant</Label>
                    <p className="text-sm text-muted-foreground">EU chemical regulations</p>
                  </div>
                  <Switch
                    checked={formData.reachCompliant}
                    onCheckedChange={(v) => updateFormData("reachCompliant", v)}
                  />
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Component Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium capitalize">{formData.componentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TU Reference</span>
                      <span className="font-mono">{formData.tuReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mill</span>
                      <span>{formData.mill}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin</span>
                      <span>{formData.countryOfOrigin}</span>
                    </div>
                    {formData.isSustainable && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        ♻️ Sustainable
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
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
      </DialogContent>
    </Dialog>
  );
}
