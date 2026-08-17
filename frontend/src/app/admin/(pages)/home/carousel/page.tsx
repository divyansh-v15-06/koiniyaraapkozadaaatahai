"use client";

import { useState } from "react";
import { Plus, Trash2, Image } from "lucide-react";
import { toast } from "sonner";

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState([
    { title: "Pioneering Computing Research & AI Innovation", url: "https://nith.ac.in", order: 1 },
    { title: "Admissions Open for Autumn Ph.D. Session 2026", url: "/news/announcements", order: 2 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Homepage Hero Carousel Banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage slide banners displayed on the public landing page.</p>
        </div>
      </div>
      <div className="space-y-4">
        {slides.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Image className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground">Link: {s.url} • Slide #{s.order}</p>
              </div>
            </div>
            <button onClick={() => { setSlides(slides.filter((_, idx) => idx !== i)); toast.success("Slide removed"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
