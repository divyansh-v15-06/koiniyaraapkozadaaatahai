"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_POSTS } from "@/lib/mock-data";

export default function AdminAchievementsPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">News &amp; Achievements Management</h1>
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start justify-between">
            <div>
              <span className="rounded bg-chart-2/10 text-chart-2 px-2 py-0.5 text-xs font-bold">{p.category}</span>
              <h3 className="font-bold text-foreground text-base mt-1.5">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.body}</p>
            </div>
            <button onClick={() => { setPosts(posts.filter((x) => x.id !== p.id)); toast.success("Achievement deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
