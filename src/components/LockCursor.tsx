import { useEffect, useRef } from "react";

// Lock-on cursor: four corner brackets follow the mouse and lock onto the corners of whatever is clickable.
// It only runs for a real mouse (not touch). When the visitor prefers reduced motion, the brackets
// snap into place without gliding, and there is no click ripple.
// If this code fails to start, the normal cursor stays, because the class that hides it is never added.

const TARGETS = "a[href], button, [role='tab'], [role='button'], summary, label[for], select";
const TYPING = "input, textarea, select, [contenteditable='true']";
const IDLE = 26; // bracket box size around the mouse, in px
const PAD = 6; // space between a locked element and the brackets

export function LockCursor() {
  const box = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || !box.current || !dot.current || !ripple.current) return;

    const root = document.documentElement;
    const b = box.current;
    const d = dot.current;
    const r = ripple.current;
    let x = -100;
    let y = -100;
    let cx = 0;
    let cy = 0;
    let cw = IDLE;
    let ch = IDLE;
    let target: Element | null = null;
    let visible = false;
    let frame = 0;

    const show = (on: boolean) => {
      visible = on;
      root.classList.toggle("lc-on", on);
    };

    const tick = () => {
      let tx = x - IDLE / 2;
      let ty = y - IDLE / 2;
      let tw = IDLE;
      let th = IDLE;
      if (target && target.isConnected) {
        const rect = target.getBoundingClientRect();
        tx = rect.left - PAD;
        ty = rect.top - PAD;
        tw = rect.width + PAD * 2;
        th = rect.height + PAD * 2;
      }
      const k = calm.matches ? 1 : 0.28;
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      cw += (tw - cw) * k;
      ch += (th - ch) * k;
      b.style.transform = `translate(${cx}px, ${cy}px)`;
      b.style.width = `${cw}px`;
      b.style.height = `${ch}px`;
      d.style.transform = `translate(${x}px, ${y}px)`;
      const settled = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tw - cw) + Math.abs(th - ch) < 0.5;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Decide what the cursor should do for the element under the mouse.
    const pick = (el: Element | null) => {
      const typing = !!el?.closest(TYPING);
      const next = typing ? null : (el?.closest(TARGETS) ?? null);
      if (!visible) {
        cx = x - IDLE / 2;
        cy = y - IDLE / 2;
      }
      show(!typing);
      if (next !== target) {
        target = next;
        b.classList.toggle("is-locked", !!target);
      }
      wake();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      pick(e.target instanceof Element ? e.target : null);
    };

    // Scrolling or a page change moves the content under a still mouse, so check again what is under it.
    let queued = 0;
    const recheck = () => {
      if (!visible || queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        pick(document.elementFromPoint(x, y));
      });
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !visible || calm.matches) return;
      r.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      r.classList.remove("is-on");
      void r.offsetWidth; // restart the ripple animation
      r.classList.add("is-on");
    };
    const onLeave = () => show(false);

    root.classList.add("lc");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    // Capture catches scrolling inside boxes too, such as wide tables.
    window.addEventListener("scroll", recheck, { passive: true, capture: true });
    window.addEventListener("hashchange", recheck);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    // Switch off straight away if the visitor changes to touch.
    const stop = () => {
      if (fine.matches) return;
      root.classList.remove("lc", "lc-on");
    };
    fine.addEventListener("change", stop);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(queued);
      root.classList.remove("lc", "lc-on");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", recheck, { capture: true });
      window.removeEventListener("hashchange", recheck);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      fine.removeEventListener("change", stop);
    };
  }, []);

  return (
    <div className="lcur" aria-hidden="true">
      <div className="lcur__box" ref={box}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="lcur__dot" ref={dot} />
      <div className="lcur__ripple" ref={ripple} />
    </div>
  );
}
