import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { tagScreen } from "@/utils/clarityTracking";
import { CareSymbolIcon } from "@/components/care-symbols/CareSymbolIcon";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StyleStatusBadge } from "@/components/styles/StyleStatusBadge";
import { StyleStageBadge } from "@/components/styles/StyleStageBadge";
import { StyleStageProgress } from "@/components/styles/StyleStageProgress";
import { getStyleById, mockTechnologists } from "@/data/mockStyles";
import { getComponentsByStyle, getComponentTestsByStyle } from "@/data/mockComponents";
import { divisionConfig, selfApprovalConfig } from "@/types/style";
import { componentStatusConfig, fibreTypeConfig, constructionConfig } from "@/types/component";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar,
  Factory,
  MapPin,
  Package,
  Users,
  FileText,
  Upload,
  Edit,
  Leaf,
  AlertCircle,
  CheckCircle2,
  Clock,
  Beaker,
  Scissors,
} from "lucide-react";
import { format, parseISO, isPast, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { FabricComponent, TrimComponent } from "@/types/component";

export default function StyleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => { tagScreen('smart-style-detail'); }, []);
  
  const style = getStyleById(id || "");
  const components = style ? getComponentsByStyle(style.id) : [];
  const tests = style ? getComponentTestsByStyle(style.id) : [];
  
  if (!style) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Style not found</h2>
          <p className="text-muted-foreground mt-1">The style you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate("/styles")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Styles
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const daysToGoldSeal = differenceInDays(parseISO(style.goldSealDate), new Date());
  const isOverdue = daysToGoldSeal < 0;
  const isAtRisk = daysToGoldSeal >= 0 && daysToGoldSeal <= 14;
  
  const fabricComponents = components.filter((c): c is FabricComponent => c.componentType === "fabric");
  const trimComponents = components.filter((c): c is TrimComponent => c.componentType === "trim");
  
  const approvedTests = tests.filter(t => t.status === "tested").length;
  const totalTests = tests.length;
  const testProgress = totalTests > 0 ? (approvedTests / totalTests) * 100 : 0;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/styles")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{style.description}</h1>
                <StyleStatusBadge status={style.status} />
                <StyleStageBadge stage={style.stage} />
              </div>
              <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                <span className="font-mono">{style.tuStyleNo}</span>
                <span>•</span>
                <span>{style.designStyleRef}</span>
                <span>•</span>
                <span>{style.productColour}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {style.status === "approved" && !style.gswStatus && (
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload GSW
              </Button>
            )}
          </div>
        </div>
        
        {/* Stage Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Testing Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StyleStageProgress currentStage={style.stage} />
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {approvedTests} of {totalTests} tests complete
                </span>
              </div>
              <Progress value={testProgress} className="flex-1 max-w-xs" />
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">
              Components
              <Badge variant="secondary" className="ml-2">{components.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="care-labels">Care Labels</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="gsw">GSW</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-4">
                {/* Key Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Key Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Fabric Cut Date</div>
                      <div className="font-medium">{format(parseISO(style.fabricCutDate), "dd MMMM yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Gold Seal Date</div>
                      <div className={cn(
                        "font-medium flex items-center gap-2",
                        isOverdue && "text-destructive",
                        isAtRisk && !isOverdue && "text-warning"
                      )}>
                        {format(parseISO(style.goldSealDate), "dd MMMM yyyy")}
                        {isOverdue && <AlertCircle className="h-4 w-4" />}
                        {isAtRisk && !isOverdue && <Clock className="h-4 w-4" />}
                      </div>
                      <div className={cn(
                        "text-xs",
                        isOverdue ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {isOverdue 
                          ? `${Math.abs(daysToGoldSeal)} days overdue`
                          : `${daysToGoldSeal} days remaining`
                        }
                      </div>
                    </div>
                    {style.baseApprovalRequired && (
                      <div>
                        <div className="text-sm text-muted-foreground">Base Approval Required</div>
                        <div className="font-medium">{format(parseISO(style.baseApprovalRequired), "dd MMMM yyyy")}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">Season</div>
                      <div className="font-medium">{style.season}</div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Product Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Division</div>
                      <div className="font-medium">{divisionConfig[style.division].label}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Department</div>
                      <div className="font-medium">{style.department}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">End Use</div>
                      <div className="font-medium">{style.endUse}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pack Type</div>
                      <div className="font-medium capitalize">{style.singleOrMultipack}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Order Quantity</div>
                      <div className="font-medium">{style.orderQuantity.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Washed Product</div>
                      <div className="font-medium">{style.washedProduct ? "Yes" : "No"}</div>
                    </div>
                    {style.washedProduct && style.eimForecastedScore && (
                      <>
                        <div>
                          <div className="text-sm text-muted-foreground">EIM Forecasted Score</div>
                          <div className="font-medium">{style.eimForecastedScore}</div>
                        </div>
                        {style.eimAchievedScore && (
                          <div>
                            <div className="text-sm text-muted-foreground">EIM Achieved Score</div>
                            <div className="font-medium">{style.eimAchievedScore}</div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
                
                {/* Factory & Origin */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Factory className="h-4 w-4" />
                      Manufacturing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Factory</div>
                      <div className="font-medium">{style.factory.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Country of Origin</div>
                      <div className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {style.countryOfOrigin}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Sidebar */}
              <div className="space-y-4">
                {/* Supplier Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Supplier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={style.supplier.logo} />
                        <AvatarFallback>{style.supplier.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{style.supplier.name}</div>
                        <div className="text-sm text-muted-foreground">{style.supplier.code}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Self-Approval Level</span>
                        <Badge variant="outline" className={selfApprovalConfig[style.supplier.selfApprovalLevel].color}>
                          {selfApprovalConfig[style.supplier.selfApprovalLevel].label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Technologists */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assigned Technologists
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={style.fabricTech.avatar} />
                        <AvatarFallback>
                          {style.fabricTech.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{style.fabricTech.name}</div>
                        <div className="text-xs text-muted-foreground">Fabric Technologist</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={style.garmentTech.avatar} />
                        <AvatarFallback>
                          {style.garmentTech.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{style.garmentTech.name}</div>
                        <div className="text-xs text-muted-foreground">Garment Technologist</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Components Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Components</span>
                      <span className="font-medium">{components.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fabrics</span>
                      <span className="font-medium">{fabricComponents.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trims</span>
                      <span className="font-medium">{trimComponents.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sustainable</span>
                      <span className="font-medium flex items-center gap-1">
                        {components.filter(c => c.isSustainable).length}
                        <Leaf className="h-3 w-3 text-success" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-4">
            {/* Fabric Components */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Fabric Components ({fabricComponents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Mill</TableHead>
                      <TableHead>Construction</TableHead>
                      <TableHead>Composition</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fabricComponents.map(comp => (
                      <TableRow key={comp.id}>
                        <TableCell className="font-mono">{comp.tuReference}</TableCell>
                        <TableCell>{comp.mill}</TableCell>
                        <TableCell>{constructionConfig[comp.construction]?.label || comp.construction}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {comp.composition.map((f, i) => (
                              <Badge key={i} variant="outline" className={cn("text-xs", f.isSustainable && "border-success text-success")}>
                                {f.percentage}% {f.fibreLabel}
                                {f.isSustainable && <Leaf className="h-3 w-3 ml-1" />}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{comp.weight} g/m²</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(componentStatusConfig[comp.status].bgColor, componentStatusConfig[comp.status].color)}>
                            {componentStatusConfig[comp.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Trim Components */}
            {trimComponents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trim Components ({trimComponents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Mill</TableHead>
                        <TableHead>Colour</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trimComponents.map(comp => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-mono">{comp.tuReference}</TableCell>
                          <TableCell>{comp.trimType}</TableCell>
                          <TableCell>{comp.mill}</TableCell>
                          <TableCell>{comp.colour}</TableCell>
                          <TableCell>{comp.material || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(componentStatusConfig[comp.status].bgColor, componentStatusConfig[comp.status].color)}>
                              {componentStatusConfig[comp.status].label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  Test Requests
                </CardTitle>
                <CardDescription>
                  Track testing progress for all components
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Code</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Lab</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Test Date</TableHead>
                        <TableHead>Results</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tests.map(test => {
                        const passedParams = test.parameters.filter(p => p.status === "pass").length;
                        return (
                          <TableRow key={test.id}>
                            <TableCell className="font-mono">{test.reportCode || "Pending"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{test.level.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>{test.labName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                test.status === "tested" && "bg-success/10 text-success",
                                test.status === "submitted" && "bg-info/10 text-info",
                                test.status === "pending" && "bg-warning/10 text-warning"
                              )}>
                                {test.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {test.testDate ? format(parseISO(test.testDate), "dd MMM yyyy") : "-"}
                            </TableCell>
                            <TableCell>
                              {test.parameters.length > 0 ? (
                                <span className="text-sm">
                                  {passedParams}/{test.parameters.length} passed
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No test requests yet. Add components to generate TRFs.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="care-labels" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Care Symbols</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {style.careSymbols.map(symbol => (
                      <div key={symbol.id} className="flex flex-col items-center p-3 border rounded-lg min-w-[80px]">
                        <CareSymbolIcon code={symbol.code} size={44} />
                        <span className="text-xs text-muted-foreground mt-2 text-center">{symbol.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Care Wording</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {style.careWording.map(wording => (
                      <li key={wording.id} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-success" />
                        <span className="text-sm">{wording.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                {style.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {style.images.map(image => (
                      <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={image.url} 
                          alt={image.description}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <div className="p-3 text-white text-sm">
                            <div className="font-medium capitalize">{image.type}</div>
                            <div className="text-white/70">{image.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No images uploaded yet.
                  </div>
                )}
                <Button variant="outline" className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gsw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Gold Seal Workbook
                </CardTitle>
                <CardDescription>
                  Final technical review document
                </CardDescription>
              </CardHeader>
              <CardContent>
                {style.status !== "approved" ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium">GSW Upload Not Available</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Style must be approved before GSW can be uploaded.
                    </p>
                  </div>
                ) : !style.gswStatus ? (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium">Ready for GSW Upload</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      All testing complete. Upload the Gold Seal Workbook for final approval.
                    </p>
                    <Button className="mt-4">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload GSW
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">GSW_v{style.gswVersion || 1}.pdf</div>
                        <div className="text-sm text-muted-foreground">
                          Submitted {style.gswSubmittedDate && format(parseISO(style.gswSubmittedDate), "dd MMM yyyy")}
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        style.gswStatus === "approved" && "bg-success/10 text-success",
                        style.gswStatus === "submitted" && "bg-info/10 text-info",
                        style.gswStatus === "rejected" && "bg-destructive/10 text-destructive"
                      )}>
                        {style.gswStatus}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
