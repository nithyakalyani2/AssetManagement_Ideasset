import { useState } from "react";
import { Search, User, Package } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetCard } from "@/components/assets/AssetCard";
import { employees, assets, Employee } from "@/lib/mockData";

export default function Employees() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
  );

  const getEmployeeAssets = (employeeId: string) =>
    assets.filter((a) => a.assignedTo?.id === employeeId);

  return (
    <MainLayout isAdmin>
      <PageHeader
        title="Employees"
        description="View employees and their assigned assets."
      />

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => {
          const employeeAssets = getEmployeeAssets(employee.id);
          return (
            <Card
              key={employee.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20"
              onClick={() => setSelectedEmployee(employee)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {employee.role}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {employee.department}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{employeeAssets.length} assets</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Employee Detail Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="block">{selectedEmployee?.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedEmployee?.email}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Department</span>
                <p className="font-medium">{selectedEmployee?.department}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Role</span>
                <p className="font-medium">{selectedEmployee?.role}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Employee ID</span>
                <p className="font-medium">{selectedEmployee?.id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total Assets</span>
                <p className="font-medium">
                  {selectedEmployee && getEmployeeAssets(selectedEmployee.id).length}
                </p>
              </div>
            </div>

            {/* Assigned Assets */}
            <div>
              <h4 className="font-semibold mb-3">Assigned Assets</h4>
              {selectedEmployee && getEmployeeAssets(selectedEmployee.id).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No assets assigned
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedEmployee &&
                    getEmployeeAssets(selectedEmployee.id).map((asset) => (
                      <AssetCard key={asset.id} asset={asset} compact />
                    ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
