import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockSuppliers, mockFactories, mockTechnologists, mockCareSymbols } from "@/data/mockStyles";
import { mockComponents } from "@/data/mockComponents";
import { divisionConfig, Season, Division } from "@/types/style";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar as CalendarIcon,
  Building2,
  Package,
  Users,
  Tag,
  Image,
  Scissors,
  Save,
  Leaf,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type WizardStep = "header" | "product" | "technologists" | "care" | "components" | "images";

const STEPS: { id: WizardStep; label: string; icon: React.ElementType }[] = [
  { id: "header", label: "Header Info", icon: Building2 },
  { id: "product", label: "Product Details", icon: Package },
  { id: "technologists", label: "Technologists", icon: Users },
  { id: "care", label: "Care Labels", icon: Tag },
  { id: "components", label: "Components", icon: Scissors },
  { id: "images", label: "Images", icon: Image },
];

export default function StyleCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>("header");
  const [formData, setFormData] = useState({
    // Header
    supplierId: "",
    factoryId: "",
    tuStyleNo: "",
    designStyleRef: "",
    description: "",
    productColour: "",
    // Product
    division: "" as Division | "",
    department: "",
    season: "" as Season | "",
    endUse: "",
    countryOfOrigin: "",
    singleOrMultipack: "single" as "single" | "multipack",
    orderQuantity: "",
    fabricCutDate: undefined as Date | undefined,
    goldSealDate: undefined as Date | undefined,
    washedProduct: false,
    eimForecastedScore: "",
    promotionalClaims: "",
    // Technologists
    fabricTechId: "",
    garmentTechId: "",
    // Care
    selectedCareSymbols: [] as string[],
    // Components
    selectedComponents: [] as string[],
    // Images
    images: [] as { file: File; type: string }[],
  });

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.supplierId || !formData.tuStyleNo || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Style created successfully!");
    navigate("/styles");
  };

  const selectedSupplier = mockSuppliers.find(s => s.id === formData.supplierId);
  const availableFactories = selectedSupplier?.factories || [];
  const availableDepartments = formData.division ? divisionConfig[formData.division]?.departments || [] : [];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/styles")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Style</h1>
            <p className="text-muted-foreground">
              Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex].label}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 text-xs transition-colors",
                    isCompleted && "text-success",
                    isCurrent && "text-primary font-medium",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                    isCompleted && "bg-success border-success text-success-foreground",
                    isCurrent && "border-primary bg-primary/10",
                    !isCompleted && !isCurrent && "border-muted"
                  )}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="hidden sm:block">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {/* Header Step */}
            {currentStep === "header" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Select value={formData.supplierId} onValueChange={(v) => updateFormData({ supplierId: v, factoryId: "" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSuppliers.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} ({s.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="factory">Factory *</Label>
                    <Select 
                      value={formData.factoryId} 
                      onValueChange={(v) => updateFormData({ factoryId: v })}
                      disabled={!formData.supplierId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select factory" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFactories.map(f => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name} ({f.country})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tuStyleNo">TU Style No *</Label>
                    <Input
                      id="tuStyleNo"
                      placeholder="9-digit style number"
                      maxLength={9}
                      value={formData.tuStyleNo}
                      onChange={(e) => updateFormData({ tuStyleNo: e.target.value.replace(/\D/g, '') })}
                    />
                    <p className="text-xs text-muted-foreground">Must be exactly 9 digits</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designStyleRef">Design Style Reference</Label>
                    <Input
                      id="designStyleRef"
                      placeholder="e.g., SS25-CREW-001"
                      value={formData.designStyleRef}
                      onChange={(e) => updateFormData({ designStyleRef: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="Product description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productColour">Product Colour</Label>
                  <Input
                    id="productColour"
                    placeholder="e.g., Navy Blue"
                    value={formData.productColour}
                    onChange={(e) => updateFormData({ productColour: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Product Step */}
            {currentStep === "product" && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Division *</Label>
                    <Select value={formData.division} onValueChange={(v) => updateFormData({ division: v as Division, department: "" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(divisionConfig) as Division[]).map(d => (
                          <SelectItem key={d} value={d}>{divisionConfig[d].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(v) => updateFormData({ department: v })}
                      disabled={!formData.division}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDepartments.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Season *</Label>
                    <Select value={formData.season} onValueChange={(v) => updateFormData({ season: v as Season })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SS24">SS24</SelectItem>
                        <SelectItem value="AW24">AW24</SelectItem>
                        <SelectItem value="SS25">SS25</SelectItem>
                        <SelectItem value="AW25">AW25</SelectItem>
                        <SelectItem value="SS26">SS26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>End Use</Label>
                    <Input
                      placeholder="e.g., Casual Wear"
                      value={formData.endUse}
                      onChange={(e) => updateFormData({ endUse: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country of Origin</Label>
                    <Input
                      placeholder="e.g., CN, BD, IN"
                      maxLength={2}
                      value={formData.countryOfOrigin}
                      onChange={(e) => updateFormData({ countryOfOrigin: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fabric Cut Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.fabricCutDate ? format(formData.fabricCutDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.fabricCutDate}
                          onSelect={(d) => updateFormData({ fabricCutDate: d })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Gold Seal Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.goldSealDate ? format(formData.goldSealDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.goldSealDate}
                          onSelect={(d) => updateFormData({ goldSealDate: d })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pack Type</Label>
                    <Select value={formData.singleOrMultipack} onValueChange={(v) => updateFormData({ singleOrMultipack: v as "single" | "multipack" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="multipack">Multipack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Order Quantity</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.orderQuantity}
                      onChange={(e) => updateFormData({ orderQuantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="washedProduct"
                      checked={formData.washedProduct}
                      onCheckedChange={(c) => updateFormData({ washedProduct: !!c })}
                    />
                    <Label htmlFor="washedProduct">Washed Product (EIM Score Required)</Label>
                  </div>
                  
                  {formData.washedProduct && (
                    <div className="pl-6 space-y-2">
                      <Label>EIM Forecasted Score</Label>
                      <Input
                        type="number"
                        placeholder="0-100"
                        value={formData.eimForecastedScore}
                        onChange={(e) => updateFormData({ eimForecastedScore: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Promotional Claims</Label>
                  <Textarea
                    placeholder="e.g., 100% Organic Cotton"
                    value={formData.promotionalClaims}
                    onChange={(e) => updateFormData({ promotionalClaims: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Technologists Step */}
            {currentStep === "technologists" && (
              <div className="space-y-6">
                <CardDescription>
                  Assign technologists for Named Routing - they will receive notifications for approvals
                </CardDescription>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Fabric Technologist *</Label>
                    <div className="space-y-2">
                      {mockTechnologists.filter(t => t.type === "fabric").map(tech => (
                        <div
                          key={tech.id}
                          onClick={() => updateFormData({ fabricTechId: tech.id })}
                          className={cn(
                            "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                            formData.fabricTechId === tech.id 
                              ? "border-primary bg-primary/5 ring-1 ring-primary" 
                              : "hover:border-primary/50"
                          )}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={tech.avatar} />
                            <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-sm text-muted-foreground">{tech.email}</div>
                          </div>
                          {formData.fabricTechId === tech.id && (
                            <Check className="ml-auto h-5 w-5 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Garment Technologist *</Label>
                    <div className="space-y-2">
                      {mockTechnologists.filter(t => t.type === "garment").map(tech => (
                        <div
                          key={tech.id}
                          onClick={() => updateFormData({ garmentTechId: tech.id })}
                          className={cn(
                            "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                            formData.garmentTechId === tech.id 
                              ? "border-primary bg-primary/5 ring-1 ring-primary" 
                              : "hover:border-primary/50"
                          )}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={tech.avatar} />
                            <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-sm text-muted-foreground">{tech.email}</div>
                          </div>
                          {formData.garmentTechId === tech.id && (
                            <Check className="ml-auto h-5 w-5 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Care Labels Step */}
            {currentStep === "care" && (
              <div className="space-y-6">
                <CardDescription>
                  Select care symbols for the product label
                </CardDescription>
                
                {["wash", "bleach", "tumble_dry", "iron", "dry_clean"].map(category => (
                  <div key={category} className="space-y-3">
                    <Label className="text-base font-medium capitalize">{category.replace("_", " ")}</Label>
                    <div className="flex flex-wrap gap-2">
                      {mockCareSymbols.filter(s => s.category === category).map(symbol => (
                        <button
                          key={symbol.id}
                          type="button"
                          onClick={() => {
                            const isSelected = formData.selectedCareSymbols.includes(symbol.id);
                            updateFormData({
                              selectedCareSymbols: isSelected
                                ? formData.selectedCareSymbols.filter(id => id !== symbol.id)
                                : [...formData.selectedCareSymbols, symbol.id]
                            });
                          }}
                          className={cn(
                            "flex flex-col items-center p-3 border rounded-lg transition-all min-w-[80px]",
                            formData.selectedCareSymbols.includes(symbol.id)
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "hover:border-primary/50"
                          )}
                        >
                          <span className="text-2xl">{symbol.icon}</span>
                          <span className="text-xs mt-1 text-center">{symbol.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {formData.selectedCareSymbols.length > 0 && (
                  <div className="pt-4 border-t">
                    <Label className="text-base font-medium">Selected Symbols</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedCareSymbols.map(id => {
                        const symbol = mockCareSymbols.find(s => s.id === id);
                        return symbol ? (
                          <Badge key={id} variant="secondary" className="gap-1">
                            {symbol.icon} {symbol.description}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Components Step */}
            {currentStep === "components" && (
              <div className="space-y-6">
                <CardDescription>
                  Link existing components or create new ones for this style
                </CardDescription>
                
                <div className="space-y-2">
                  {mockComponents.map(comp => (
                    <div
                      key={comp.id}
                      onClick={() => {
                        const isSelected = formData.selectedComponents.includes(comp.id);
                        updateFormData({
                          selectedComponents: isSelected
                            ? formData.selectedComponents.filter(id => id !== comp.id)
                            : [...formData.selectedComponents, comp.id]
                        });
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all",
                        formData.selectedComponents.includes(comp.id)
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-primary/50"
                      )}
                    >
                      <Checkbox 
                        checked={formData.selectedComponents.includes(comp.id)}
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{comp.tuReference}</span>
                          <Badge variant="outline">
                            {comp.componentType === "fabric" ? "🧵 Fabric" : "🔘 Trim"}
                          </Badge>
                          {comp.isSustainable && (
                            <Badge variant="outline" className="border-success text-success">
                              <Leaf className="h-3 w-3 mr-1" />
                              Sustainable
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {comp.mill} • {comp.countryOfOrigin}
                        </div>
                      </div>
                      {formData.selectedComponents.includes(comp.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  <Scissors className="h-4 w-4 mr-2" />
                  Create New Component
                </Button>
              </div>
            )}

            {/* Images Step */}
            {currentStep === "images" && (
              <div className="space-y-6">
                <CardDescription>
                  Upload product images (optional - can be added later)
                </CardDescription>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["front", "back", "detail", "other"].map(type => (
                    <div
                      key={type}
                      className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Image className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground capitalize">{type}</span>
                      <span className="text-xs text-muted-foreground">Click to upload</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Style No:</span> {formData.tuStyleNo || "—"}</div>
                    <div><span className="text-muted-foreground">Description:</span> {formData.description || "—"}</div>
                    <div><span className="text-muted-foreground">Supplier:</span> {selectedSupplier?.name || "—"}</div>
                    <div><span className="text-muted-foreground">Season:</span> {formData.season || "—"}</div>
                    <div><span className="text-muted-foreground">Components:</span> {formData.selectedComponents.length}</div>
                    <div><span className="text-muted-foreground">Care Symbols:</span> {formData.selectedCareSymbols.length}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStepIndex === STEPS.length - 1 ? (
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Create Style
            </Button>
          ) : (
            <Button onClick={goNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
