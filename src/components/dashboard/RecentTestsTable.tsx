import { MoreHorizontal, ExternalLink, FileText, Eye } from "lucide-react";
import { StatusBadge, TestStatus } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Test {
  id: string;
  testId: string;
  productName: string;
  supplier: string;
  testType: string;
  status: TestStatus;
  scheduledDate: string;
  completedDate?: string;
}

const recentTests: Test[] = [
  {
    id: "1",
    testId: "TST-2024-0847",
    productName: "Industrial Safety Helmet Model X200",
    supplier: "SafeGuard Manufacturing Co.",
    testType: "Impact Resistance",
    status: "passed",
    scheduledDate: "2024-01-28",
    completedDate: "2024-01-30",
  },
  {
    id: "2",
    testId: "TST-2024-0848",
    productName: "Chemical Resistant Gloves Type B",
    supplier: "ProtecHands Industries",
    testType: "Chemical Permeation",
    status: "in_progress",
    scheduledDate: "2024-02-01",
  },
  {
    id: "3",
    testId: "TST-2024-0849",
    productName: "Fire Retardant Fabric Roll #45",
    supplier: "TextilePro Ltd.",
    testType: "Flame Resistance",
    status: "failed",
    scheduledDate: "2024-01-25",
    completedDate: "2024-01-27",
  },
  {
    id: "4",
    testId: "TST-2024-0850",
    productName: "Electrical Insulation Mat 5kV",
    supplier: "ElectraSafe Corp.",
    testType: "Dielectric Strength",
    status: "pending",
    scheduledDate: "2024-02-05",
  },
  {
    id: "5",
    testId: "TST-2024-0851",
    productName: "Anti-Static Work Boots",
    supplier: "SafeStep Industries",
    testType: "ESD Compliance",
    status: "scheduled",
    scheduledDate: "2024-02-10",
  },
  {
    id: "6",
    testId: "TST-2024-0852",
    productName: "Respiratory Filter Cartridge R200",
    supplier: "AirPure Technologies",
    testType: "Filtration Efficiency",
    status: "passed",
    scheduledDate: "2024-01-20",
    completedDate: "2024-01-22",
  },
];

export function RecentTestsTable() {
  return (
    <div className="bg-card rounded-xl border border-border/60 overflow-hidden shadow-card">
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Recent Tests</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Latest quality tests and inspections
            </p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Test ID</TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Test Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTests.map((test) => (
              <TableRow key={test.id} className="table-row-hover">
                <TableCell className="font-medium text-primary">
                  {test.testId}
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1 max-w-[200px]">{test.productName}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {test.supplier}
                </TableCell>
                <TableCell>{test.testType}</TableCell>
                <TableCell>
                  <StatusBadge status={test.status} size="sm" />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {test.completedDate || test.scheduledDate}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Download Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in New Tab
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
