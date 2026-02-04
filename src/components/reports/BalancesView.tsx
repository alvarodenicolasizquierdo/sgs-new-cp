import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { mockBalances } from "@/data/mockReports";
import { cn } from "@/lib/utils";

export function BalancesView() {
  const totalPending = mockBalances.reduce((sum, b) => sum + b.pending, 0);
  const totalCompleted = mockBalances.reduce((sum, b) => sum + b.completed, 0);
  const totalFailed = mockBalances.reduce((sum, b) => sum + b.failed, 0);
  const grandTotal = totalPending + totalCompleted + totalFailed;

  return (
    <div className="space-y-6">
      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${grandTotal.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+8.2% this month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-l-4 border-l-warning">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
              <Progress
                value={(totalPending / grandTotal) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-success">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCompleted.toLocaleString()}</div>
              <Progress
                value={(totalCompleted / grandTotal) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFailed.toLocaleString()}</div>
              <Progress
                value={(totalFailed / grandTotal) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Balances Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Balance by Category</CardTitle>
              <Badge variant="secondary">Last 30 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBalances.map((balance, index) => {
                  const trend = Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "neutral";
                  const trendValue = (Math.random() * 20).toFixed(1);
                  
                  return (
                    <motion.tr
                      key={balance.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      className="table-row-hover"
                    >
                      <TableCell className="font-medium">{balance.category}</TableCell>
                      <TableCell className="text-right text-warning font-medium tabular-nums">
                        ${balance.pending.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-success font-medium tabular-nums">
                        ${balance.completed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-destructive font-medium tabular-nums">
                        ${balance.failed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums">
                        ${balance.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "flex items-center justify-end gap-1 text-sm",
                          trend === "up" && "text-success",
                          trend === "down" && "text-destructive",
                          trend === "neutral" && "text-muted-foreground"
                        )}>
                          {trend === "up" && <ArrowUpRight className="h-4 w-4" />}
                          {trend === "down" && <ArrowDownRight className="h-4 w-4" />}
                          {trend === "neutral" && <Minus className="h-4 w-4" />}
                          <span>{trendValue}%</span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockBalances.map((balance) => (
              <div key={balance.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{balance.category}</span>
                  <span className="text-muted-foreground">
                    ${balance.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                  <div
                    className="bg-success transition-all duration-500"
                    style={{ width: `${(balance.completed / balance.total) * 100}%` }}
                  />
                  <div
                    className="bg-warning transition-all duration-500"
                    style={{ width: `${(balance.pending / balance.total) * 100}%` }}
                  />
                  <div
                    className="bg-destructive transition-all duration-500"
                    style={{ width: `${(balance.failed / balance.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
