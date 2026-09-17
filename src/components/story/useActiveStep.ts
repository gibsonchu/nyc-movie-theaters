"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks which of `count` step elements is currently nearest the vertical
 * center of the viewport, for scrollytelling sections: a tall column of
 * step divs on one side, a sticky visual on the other that reacts to
 * `active`. Attach `setRef(i)` to each step's wrapper div.
 */
export function useActiveStep(count: number) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = refs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    const nodes = refs.current.slice(0, count);
    nodes.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };

  return { active, setRef };
}
