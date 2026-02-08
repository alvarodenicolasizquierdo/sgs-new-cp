import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Profile images
import karukaAvatar from "@/assets/profiles/karuka.jpg";
import alvaroAvatar from "@/assets/profiles/alvaro.jpg";
import ammAvatar from "@/assets/profiles/amm.jpg";
import saritaAvatar from "@/assets/profiles/sarita.jpg";
import markAvatar from "@/assets/profiles/mark.png";
import hajraAvatar from "@/assets/profiles/hajra.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  UserCog,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Key,
  Trash2,
  Info,
} from "lucide-react";
import { format } from "date-fns";

// Canonical SGS Entitlement Tiers
type EntitlementTier = "none" | "bronze" | "silver" | "gold" | "buyer" | "garment_tech" | "fabric_tech";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "inspector" | "viewer";
  entitlementTier: EntitlementTier;
  department: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

const entitlementTierConfig: Record<EntitlementTier, { 
  label: string; 
  color: string;
  careCodes: boolean;
  baseApproval: boolean;
  bulkApproval: boolean;
  productApproval: boolean;
  description: string;
}> = {
  none: { 
    label: "None", 
    color: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
    careCodes: false, baseApproval: false, bulkApproval: false, productApproval: false,
    description: "No approval permissions"
  },
  buyer: { 
    label: "Buyer", 
    color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    careCodes: false, baseApproval: false, bulkApproval: false, productApproval: false,
    description: "Read-only access — no approval authority"
  },
  bronze: { 
    label: "Bronze", 
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    careCodes: true, baseApproval: false, bulkApproval: false, productApproval: false,
    description: "Care code access only"
  },
  fabric_tech: { 
    label: "Fabric Tech", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    careCodes: true, baseApproval: true, bulkApproval: false, productApproval: false,
    description: "Base approval only"
  },
  silver: { 
    label: "Silver", 
    color: "bg-slate-200 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
    careCodes: true, baseApproval: true, bulkApproval: true, productApproval: false,
    description: "Base + Bulk approval"
  },
  gold: { 
    label: "Gold", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    careCodes: true, baseApproval: true, bulkApproval: true, productApproval: true,
    description: "Full approval authority"
  },
  garment_tech: { 
    label: "Garment Tech", 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    careCodes: true, baseApproval: true, bulkApproval: true, productApproval: true,
    description: "Full approval + GSW authority"
  },
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "Mark Thompson",
    email: "mark.thompson@sgs.com",
    role: "admin",
    entitlementTier: "gold",
    department: "Quality Assurance",
    status: "active",
    lastLogin: "2024-01-15T09:30:00Z",
    createdAt: "2023-06-01T00:00:00Z",
    avatar: markAvatar,
  },
  {
    id: "2",
    name: "Karuka Yamamoto",
    email: "karuka.yamamoto@sgs.com",
    role: "manager",
    entitlementTier: "gold",
    department: "Testing Lab",
    status: "active",
    lastLogin: "2024-01-14T14:20:00Z",
    createdAt: "2023-08-15T00:00:00Z",
    avatar: karukaAvatar,
  },
  {
    id: "3",
    name: "Alvaro Mendez",
    email: "alvaro.mendez@sgs.com",
    role: "inspector",
    entitlementTier: "silver",
    department: "Field Inspection",
    status: "active",
    lastLogin: "2024-01-15T08:00:00Z",
    createdAt: "2023-09-20T00:00:00Z",
    avatar: alvaroAvatar,
  },
  {
    id: "4",
    name: "Amm Rattanakorn",
    email: "amm.rattanakorn@sgs.com",
    role: "inspector",
    entitlementTier: "fabric_tech",
    department: "Quality Assurance",
    status: "active",
    lastLogin: "2023-12-01T10:00:00Z",
    createdAt: "2023-07-10T00:00:00Z",
    avatar: ammAvatar,
  },
  {
    id: "5",
    name: "Sarita Kim",
    email: "sarita.kim@sgs.com",
    role: "viewer",
    entitlementTier: "buyer",
    department: "Compliance",
    status: "pending",
    lastLogin: "",
    createdAt: "2024-01-10T00:00:00Z",
    avatar: saritaAvatar,
  },
  {
    id: "6",
    name: "Hajra Begum",
    email: "hajra.begum@sgs.com",
    role: "manager",
    entitlementTier: "garment_tech",
    department: "Compliance",
    status: "active",
    lastLogin: "2024-01-13T11:45:00Z",
    createdAt: "2023-05-20T00:00:00Z",
    avatar: hajraAvatar,
  },
];

const roleConfig = {
  admin: { label: "Admin", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  manager: { label: "Manager", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  inspector: { label: "Inspector", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  viewer: { label: "Viewer", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
};

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === "active").length,
    pending: mockUsers.filter((u) => u.status === "pending").length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage team members and their access permissions
            </p>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Send an invitation to add a new team member
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" placeholder="user@example.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="inspector">Inspector</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entitlement">Entitlement Tier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entitlement tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(entitlementTierConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label} — {config.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                      <SelectItem value="testing">Testing Lab</SelectItem>
                      <SelectItem value="field">Field Inspection</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsInviteDialogOpen(false)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
              <UserX className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="inspector">Inspector</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Entitlement Tier
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-sm text-xs">
                          <p className="font-medium mb-1">SGS Authority Model</p>
                          <p>Controls approval permissions: Care Codes, Base, Bulk, and Product/Garment approvals. Garment Tech can also approve GSW.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const role = roleConfig[user.role];
                const status = statusConfig[user.status];
                const tier = entitlementTierConfig[user.entitlementTier];
                const isSelected = selectedUsers.has(user.id);

                return (
                  <TableRow
                    key={user.id}
                    className={isSelected ? "bg-primary/5" : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={role.color}>
                        {role.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className={tier.color}>
                              {tier.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">
                            <div className="space-y-1">
                              <p className="font-medium">{tier.description}</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
                                <span>Care Codes:</span><span>{tier.careCodes ? "✓" : "✗"}</span>
                                <span>Base Approval:</span><span>{tier.baseApproval ? "✓" : "✗"}</span>
                                <span>Bulk Approval:</span><span>{tier.bulkApproval ? "✓" : "✗"}</span>
                                <span>Product Approval:</span><span>{tier.productApproval ? "✓" : "✗"}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.department}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastLogin
                        ? format(new Date(user.lastLogin), "MMM d, yyyy")
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserCog className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Entitlement Tier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
