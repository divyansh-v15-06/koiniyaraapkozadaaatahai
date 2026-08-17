import { Award } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mock-data";

export default function AchievementsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Accolades &amp; Honors</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Achievements &amp; Honors
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Recognitions, hackathon victories, and honors received by faculty and students.
        </p>
      </div>

      <div className="space-y-6">
        {MOCK_POSTS.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-chart-2/10 px-2.5 py-0.5 text-xs font-bold text-chart-2">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{post.publish_date}</span>
            </div>

            <h3 className="mt-3 text-lg font-bold text-foreground leading-snug">{post.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
