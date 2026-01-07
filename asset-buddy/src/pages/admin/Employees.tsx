import { useEffect, useState } from "react";
import { Search, User, Package } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetCard } from "@/components/assets/AssetCard";
import { employees, assets, Employee } from "@/lib/mockData";
import * as tf from "@tensorflow/tfjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OpenAI from "openai";
import axios from "axios";

const Employees = () => {
  // useEffect(() => {
  //   const run = async () => {
  //     const apiKey = import.meta.env.VITE_APP_AI_KEY;

  //     console.log("API KEY:", apiKey);
  //     console.log("KEY EXISTS:", !!apiKey);

  //     const client = new OpenAI({
  //       apiKey,
  //       dangerouslyAllowBrowser: true,
  //     });

  //     const response = await client.responses.create({
  //       model: "gpt-5.2",
  //       input: "Write a short bedtime story about a unicorn.",
  //     });

  //     console.log(response.output_text, "llllll");
  //   };

  //   run();
  // }, []);

  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [role, setRole] = useState(null);
  const ROLES = ["Designer", "Developer", "Tester", "Manager"];
  const ASSETS = ["MacBook Pro", "Dell XPS", "ThinkPad", "MacBook Air"];
  const roleToVector = (role: string) => ROLES.map((r) => (r === role ? 1 : 0));
  const TRAINING_DATA = [
    { role: "Designer", asset: "MacBook Pro" },
    { role: "Developer", asset: "Dell XPS" },
    { role: "Tester", asset: "ThinkPad" },
    { role: "Manager", asset: "MacBook Air" },
  ];

  const assetToVector = (asset: string) =>
    ASSETS.map((a) => (a === asset ? 1 : 0));

  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState<{
    asset: string;
    confidence: string;
  } | null>(null);

  useEffect(() => {
    async function trainModel() {
      const xs = tf.tensor2d(TRAINING_DATA.map((d) => roleToVector(d.role)));

      const ys = tf.tensor2d(TRAINING_DATA.map((d) => assetToVector(d.asset)));

      const m = tf.sequential();

      m.add(
        tf.layers.dense({
          inputShape: [ROLES.length],
          units: 16,
          activation: "relu",
        })
      );

      m.add(
        tf.layers.dense({
          units: ASSETS.length,
          activation: "softmax",
        })
      );

      m.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      await m.fit(xs, ys, {
        epochs: 200,
        shuffle: true,
        verbose: 0,
      });

      setModel(m);
      console.log("✅ AI model trained");
    }

    trainModel();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/with-assets")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const ROLE_ASSET_MAP = {
    Designer: ["MacBook Pro", "iPad Pro", "Apple Pencil", "4K Monitor"],
    Developer: [
      "Dell XPS",
      "MacBook Air",
      "Mechanical Keyboard",
      '27" Monitor',
    ],
    Tester: ["Lenovo ThinkPad", "Android Test Devices", "iPhone"],
    Manager: ["MacBook Air", "iPhone", "Noise Cancelling Headset"],
  };

  function predictAssets() {
    if (!model || !role) return;

    const input = tf.tensor2d([roleToVector(role)]);
    const output = model.predict(input) as tf.Tensor;

    const scores = output.dataSync();
    const maxIndex = scores.indexOf(Math.max(...scores));

    setPrediction({
      asset: ASSETS[maxIndex],
      confidence: (scores[maxIndex] * 100).toFixed(2) + "%",
    });
  }

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

      <div>
        <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
          <Card className="w-full max-w-xl rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-6">
              <h1 className="text-2xl font-semibold">
                AI Role-Based Asset Suggestions
              </h1>

              <Select onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employee role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ROLE_ASSET_MAP).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {role && (
                <div className="space-y-3">
                  <h2 className="text-lg font-medium">
                    Recommended Assets for {role}
                  </h2>
                  <ul className="list-disc list-inside text-slate-700">
                    {ROLE_ASSET_MAP[role].map((asset) => (
                      <li key={asset}>{asset}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button className="w-full" onClick={predictAssets}>
                Allocate Assets
              </Button>
            </CardContent>
            {prediction && (
              <div className="mt-4 rounded-lg border p-4 bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-600">
                  AI Recommendation
                </h3>
                <p className="text-lg font-medium">{prediction.asset}</p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {prediction.confidence}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Employee Detail Modal */}
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
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
                <span className="text-sm text-muted-foreground">
                  Department
                </span>
                <p className="font-medium">{selectedEmployee?.department}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Role</span>
                <p className="font-medium">{selectedEmployee?.role}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Employee ID
                </span>
                <p className="font-medium">{selectedEmployee?.id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Total Assets
                </span>
                <p className="font-medium">
                  {selectedEmployee &&
                    getEmployeeAssets(selectedEmployee.id).length}
                </p>
              </div>
            </div>

            {/* Assigned Assets */}
            <div>
              <h4 className="font-semibold mb-3">Assigned Assets</h4>
              {selectedEmployee &&
              getEmployeeAssets(selectedEmployee.id).length === 0 ? (
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
};

export default Employees;
