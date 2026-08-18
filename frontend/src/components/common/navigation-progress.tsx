"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";

function ProgressContent() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When path changes, complete the animation
    setProgress(30);
    const t1 = setTimeout(() => setProgress(75), 80);
    const t2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 250);
    }, 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  // Intercept click on internal links to start progress bar instantly
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !target.hasAttribute("download") &&
        target.getAttribute("target") !== "_blank"
      ) {
        setIsNavigating(true);
        setProgress(25);
        setTimeout(() => setProgress((prev) => (prev < 80 ? prev + 35 : prev)), 100);
      }
    };

    document.addEventListener("click", handleLinkClick, { passive: true });
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  if (progress === 0 && !isNavigating) return null;

  return (
    <div className="absolute top-0 left-0 right-0 h-[3px] z-[9999] overflow-hidden bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#33110e] via-[#85261e] to-amber-400 transition-all duration-200 ease-out shadow-[0_0_8px_#85261e]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: "width 200ms ease, opacity 250ms ease",
        }}
      />
    </div>
  );
}

export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressContent />
    </Suspense>
  );
}
