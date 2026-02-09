import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Building2,
  Key,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Save,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Database,
  Webhook,
} from "lucide-react";

import markAvatar from "@/assets/profiles/mark.png";

export default function Settings() {
  const [theme, setTheme] = useState("system");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [testAlerts, setTestAlerts] = useState(true);
  const [inspectionAlerts, setInspectionAlerts] = useState(true);
  const [supplierUpdates, setSupplierUpdates] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
         <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground/80">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Organization</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Webhook className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Profile Information</CardTitle>
                <CardDescription className="text-muted-foreground/70">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={markAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      MT
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground/60">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Mark" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Thompson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="mark.thompson@sgs.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" defaultValue="Quality Assurance Manager" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a little about yourself..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Notification Preferences</CardTitle>
                <CardDescription className="text-muted-foreground/70">
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground/70">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground/70">
                          Receive push notifications on your device
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="font-medium">Test Results</p>
                          <p className="text-sm text-muted-foreground/70">
                            When test results are ready
                          </p>
                        </div>
                      </div>
                      <Switch checked={testAlerts} onCheckedChange={setTestAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="font-medium">Inspection Alerts</p>
                          <p className="text-sm text-muted-foreground/70">
                            Critical inspection findings
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={inspectionAlerts}
                        onCheckedChange={setInspectionAlerts}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Supplier Updates</p>
                          <p className="text-sm text-muted-foreground/70">
                            Changes to supplier status
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={supplierUpdates}
                        onCheckedChange={setSupplierUpdates}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Weekly Digest</p>
                          <p className="text-sm text-muted-foreground/70">
                            Summary of weekly activities
                          </p>
                        </div>
                      </div>
                      <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Password</CardTitle>
                <CardDescription className="text-muted-foreground/70">Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="gap-2">
                  <Key className="h-4 w-4" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Two-Factor Authentication</CardTitle>
                <CardDescription className="text-muted-foreground/70">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground/70">
                        Use an authenticator app for additional security
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                {twoFactorEnabled && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code with your authenticator app to set up 2FA.
                    </p>
                    <div className="mt-4 w-32 h-32 bg-background rounded-lg border flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">QR Code</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Active Sessions</CardTitle>
                <CardDescription className="text-muted-foreground/70">Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Chrome on Windows</p>
                        <p className="text-xs text-muted-foreground/60">
                          Current session • London, UK
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Safari on iPhone</p>
                        <p className="text-xs text-muted-foreground/60">
                          Last active 2 hours ago • London, UK
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Revoke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Theme</CardTitle>
                <CardDescription className="text-muted-foreground/70">Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Light</p>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Dark</p>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === "system"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                    >
                      <Monitor className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">System</p>
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full sm:w-64">
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger className="w-full sm:w-64">
                        <Clock className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                        <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                        <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                        <SelectItem value="cet">Central European (GMT+1)</SelectItem>
                        <SelectItem value="jst">Japan Standard (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organization" className="space-y-6">
            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Organization Details</CardTitle>
                <CardDescription className="text-muted-foreground/70">
                  Manage your organization's information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" defaultValue="SGS Testing Portal" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgId">Organization ID</Label>
                    <Input id="orgId" defaultValue="SGS-2024-001" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="textile">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="textile">Textiles & Apparel</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Organization Size</Label>
                    <Select defaultValue="enterprise">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">1-50 employees</SelectItem>
                        <SelectItem value="medium">51-200 employees</SelectItem>
                        <SelectItem value="large">201-1000 employees</SelectItem>
                        <SelectItem value="enterprise">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      defaultValue="1 Place des Alpes, P.O. Box 2152, 1211 Geneva 1, Switzerland"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Data Management</CardTitle>
                <CardDescription className="text-muted-foreground/70">Export or delete your organization data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-muted/40"><Database className="h-5 w-5 text-muted-foreground" /></span>
                    <div>
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-muted-foreground/70">
                        Download all your organization data
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">Connected Services</CardTitle>
                <CardDescription className="text-muted-foreground/70">
                  Manage third-party integrations and API connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">SAP</span>
                      </div>
                      <div>
                        <p className="font-medium">SAP Integration</p>
                        <p className="text-sm text-muted-foreground/70">
                          Sync supplier and order data
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">SF</span>
                      </div>
                      <div>
                        <p className="font-medium">Salesforce</p>
                        <p className="text-sm text-muted-foreground/70">
                          CRM and customer data sync
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                        <Webhook className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Webhooks</p>
                        <p className="text-sm text-muted-foreground/70">
                          Send real-time notifications to external services
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 rounded-xl shadow-card">
              <CardHeader>
                <CardTitle className="font-semibold">API Access</CardTitle>
                <CardDescription className="text-muted-foreground/70">Manage API keys for programmatic access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Production API Key</p>
                    <p className="text-xs text-muted-foreground/60 font-mono">
                      sk_live_****************************a1b2
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      Revoke
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Key className="h-4 w-4" />
                  Generate New API Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
