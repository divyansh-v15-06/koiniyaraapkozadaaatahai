"use client";

import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_STAFF } from "@/lib/mock-data";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState(MOCK_STAFF);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Technical and administrative staff records.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {staff.map((st) => (
          <div key={st.id} className="flex items-center justify-between p-5">
            <div>
              <p className="font-bold text-foreground text-sm">{st.name}</p>
              <p className="text-xs text-muted-foreground">{st.designation} • {st.email} • {st.phone}</p>
            </div>
            <button onClick={() => { setStaff(staff.filter((x) => x.id !== st.id)); toast.success("Staff deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
