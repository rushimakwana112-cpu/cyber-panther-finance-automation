import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const RM_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True when the visitor has asked the OS for reduced motion. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Smoothly tweens an array of numbers to new targets (used for chart transitions).
 * Arrays of different lengths are handled by easing missing points in from the nearest one.
 * Jumps immediately when reduced motion is on.
 */
export function useTweenedArray(target: number[], duration = 650): number[] {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (reduced) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const k = easeOutCubic(t);
      const next = target.map((v, i) => {
        const f = from[i] ?? from[from.length - 1] ?? v;
        return f + (v - f) * k;
      });
      current.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target.join(","), reduced, duration]);

  return value;
}

export const useTweened = (target: number, duration = 650) => useTweenedArray([target], duration)[0];

/** Reports once when an element first scrolls into view. */
export function useInView<T extends HTMLElement = HTMLElement>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, visible };
}

/** Arrow / Home / End keyboard handling for a list of tabs or radio buttons. */
export function rovingKey(e: React.KeyboardEvent, index: number, count: number, vertical = false): number | null {
  const next = vertical ? "ArrowDown" : "ArrowRight";
  const prev = vertical ? "ArrowUp" : "ArrowLeft";
  let to: number | null = null;
  if (e.key === next || e.key === "ArrowRight" || e.key === "ArrowDown") to = (index + 1) % count;
  else if (e.key === prev || e.key === "ArrowLeft" || e.key === "ArrowUp") to = (index - 1 + count) % count;
  else if (e.key === "Home") to = 0;
  else if (e.key === "End") to = count - 1;
  if (to !== null) e.preventDefault();
  return to;
}
