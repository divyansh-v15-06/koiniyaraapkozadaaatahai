"use client";

import { useState } from "react";
import { MonitorSmartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";

export default function AdminEquipmentsPage() {
  const [equipments, setEquipments] = useState([
    { name: "Supermicro 4-Node GPU Server (NVIDIA A100)", lab: "Cloud Computing Lab", cost: 3450000, purchased: "2023" },
    { name: "Tesla V100 Deep Learning Workstation", lab: "AI & Medical Vision Lab", cost: 1200000, purchased: "2022" },
    { name: "FPGA Hardware Security Testing Rack", lab: "Cybersecurity Lab", cost: 850000, purchased: "2024" },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Lab Equipment &amp; Assets</h1>
      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {equipments.map((eq, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <MonitorSmartphone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-foreground text-sm">{eq.name}</p>
                <p className="text-xs text-muted-foreground">{eq.lab} • Purchased {eq.purchased}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-primary text-sm">{formatINR(eq.cost)}</span>
              <button onClick={() => { setEquipments(equipments.filter((_, idx) => idx !== i)); toast.success("Asset removed"); }} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
