// Cross-section helper: any "Discuss this service" button calls this to jump to the
// contact form with the service preselected.

export const SELECT_SERVICE_EVENT = "cp:select-service";

export function goToContact(serviceId?: string) {
  if (serviceId) window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: serviceId }));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("contact")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => document.getElementById("f-name")?.focus({ preventScroll: true }), reduced ? 0 : 650);
}
