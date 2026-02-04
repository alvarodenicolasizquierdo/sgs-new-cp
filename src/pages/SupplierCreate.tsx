import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Upload,
  X,
  Shield,
  Star,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const availableCertifications = [
  { id: "gots", label: "GOTS", description: "Global Organic Textile Standard" },
  { id: "oeko-tex", label: "OEKO-TEX", description: "Standard 100 by OEKO-TEX" },
  { id: "iso-9001", label: "ISO 9001", description: "Quality Management System" },
  { id: "iso-14001", label: "ISO 14001", description: "Environmental Management" },
  { id: "wrap", label: "WRAP", description: "Worldwide Responsible Accredited Production" },
  { id: "bsci", label: "BSCI", description: "Business Social Compliance Initiative" },
  { id: "grs", label: "GRS", description: "Global Recycled Standard" },
  { id: "bci", label: "BCI", description: "Better Cotton Initiative" },
];

const specializationOptions = [
  "Cotton",
  "Synthetic",
  "Denim",
  "Jersey",
  "Fleece",
  "Knitwear",
  "Woven",
  "Technical Fabrics",
  "Outerwear",
  "Activewear",
  "Intimates",
  "Silk",
  "Linen",
  "Buttons",
  "Zippers",
  "Labels",
  "Premium Cotton",
  "Sustainable Fabrics",
];

const countryOptions = [
  "Bangladesh",
  "China",
  "India",
  "Indonesia",
  "Pakistan",
  "Portugal",
  "Turkey",
  "Vietnam",
  "Cambodia",
  "Myanmar",
  "Thailand",
  "Sri Lanka",
  "Morocco",
  "Egypt",
  "Ethiopia",
];

interface CertificationFile {
  id: string;
  name: string;
  file: File;
  certification: string;
}

export default function SupplierCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Company Info
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  
  // Contact Details
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRole, setContactRole] = useState("");
  
  // Tier & Status
  const [tier, setTier] = useState<string>("");
  
  // Certifications
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [certificationFiles, setCertificationFiles] = useState<CertificationFile[]>([]);
  
  // Specializations
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  
  // Notes
  const [notes, setNotes] = useState("");

  const handleCertificationToggle = (certId: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(certId)
        ? prev.filter((id) => id !== certId)
        : [...prev, certId]
    );
  };

  const handleSpecializationToggle = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec)
        ? prev.filter((s) => s !== spec)
        : [...prev, spec]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, certification: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: CertificationFile[] = Array.from(files).map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        file,
        certification,
      }));
      setCertificationFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeFile = (fileId: string) => {
    setCertificationFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !companyCode || !country || !tier) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!contactName || !contactEmail) {
      toast.error("Please provide contact details");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Supplier created successfully!", {
      description: `${companyName} has been added to your supplier directory.`,
    });
    
    setIsSubmitting(false);
    navigate("/suppliers");
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/suppliers")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Suppliers
        </Button>
        <h1 className="text-2xl font-bold">Add New Supplier</h1>
        <p className="text-muted-foreground mt-1">
          Register a new supplier in your quality management system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Company Information */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Company Information
            </CardTitle>
            <CardDescription>Basic details about the supplier company</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCode">
                Supplier Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyCode"
                placeholder="e.g., TEX-001"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-destructive">*</span>
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-secondary/30">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Full street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-secondary/30 resize-none"
                rows={2}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  placeholder="https://www.example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="bg-secondary/30 pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Primary Contact
            </CardTitle>
            <CardDescription>Main point of contact for this supplier</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contactName">
                Contact Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactName"
                  placeholder="Full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-secondary/30 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactRole">Role / Title</Label>
              <Input
                id="contactRole"
                placeholder="e.g., Quality Manager"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="email@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="bg-secondary/30 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPhone"
                  placeholder="+1 234 567 8900"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="bg-secondary/30 pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier Selection */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-primary" />
              Supplier Tier
            </CardTitle>
            <CardDescription>Assign a tier level based on supplier relationship</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "strategic", label: "Strategic", description: "Key long-term partner", color: "border-primary bg-primary/5" },
                { value: "preferred", label: "Preferred", description: "High-performing supplier", color: "border-info bg-info/5" },
                { value: "approved", label: "Approved", description: "Meets all requirements", color: "border-muted-foreground bg-muted/30" },
                { value: "probation", label: "Probation", description: "Under evaluation", color: "border-destructive bg-destructive/5" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTier(option.value)}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-[1.02]",
                    tier === option.value
                      ? option.color
                      : "border-border bg-secondary/20 hover:border-muted-foreground/50"
                  )}
                >
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Certifications
            </CardTitle>
            <CardDescription>Select applicable certifications and upload supporting documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {availableCertifications.map((cert) => (
                <label
                  key={cert.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedCertifications.includes(cert.id)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/20 hover:border-muted-foreground/50"
                  )}
                >
                  <Checkbox
                    checked={selectedCertifications.includes(cert.id)}
                    onCheckedChange={() => handleCertificationToggle(cert.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{cert.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{cert.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedCertifications.length > 0 && (
              <div className="pt-4 border-t border-border">
                <Label className="text-sm font-medium mb-3 block">Upload Certification Documents</Label>
                <div className="space-y-3">
                  {selectedCertifications.map((certId) => {
                    const cert = availableCertifications.find((c) => c.id === certId);
                    const files = certificationFiles.filter((f) => f.certification === certId);
                    
                    return (
                      <div key={certId} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{cert?.label}</p>
                          {files.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {files.map((file) => (
                                <Badge
                                  key={file.id}
                                  variant="secondary"
                                  className="flex items-center gap-1.5 pl-2 pr-1 py-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span className="max-w-[120px] truncate text-xs">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(file.id)}
                                    className="p-0.5 hover:bg-destructive/20 rounded"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            id={`file-${certId}`}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            onChange={(e) => handleFileUpload(e, certId)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-${certId}`)?.click()}
                          >
                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Accepted formats: PDF, JPG, PNG. Max file size: 10MB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Specializations
            </CardTitle>
            <CardDescription>Select the materials and product types this supplier specializes in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {specializationOptions.map((spec) => (
                <Badge
                  key={spec}
                  variant={selectedSpecializations.includes(spec) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedSpecializations.includes(spec)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  )}
                  onClick={() => handleSpecializationToggle(spec)}
                >
                  {spec}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes</CardTitle>
            <CardDescription>Any other relevant information about this supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter any additional notes or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary/30 resize-none"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/suppliers")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent/90 text-accent-foreground min-w-[140px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Supplier"
            )}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
