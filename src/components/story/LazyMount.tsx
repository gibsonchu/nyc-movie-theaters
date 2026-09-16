"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Defers mounting expensive children (e.g. a second MapLibre instance) until
 * they're about to scroll into view, so the page doesn't pay for two live
 * maps loading at once on first paint.
 */
export function LazyMount({
  children,
  fallback,
  rootMargin = "600px",
}: {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true);
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}
