// One consistent 24px line-icon set (1.6 stroke). Add paths here to add icons.

const paths = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12.5l4.5 4.5L19 7",
  ledger: "M6 3h10l3 3v15H6zM9 8h6M9 12h7M9 16h4",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  flow: "M5 6h4v4H5zM15 14h4v4h-4zM9 8h3a3 3 0 013 3v3",
  file: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  database:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  filter: "M4 5h16l-6 7v6l-4 2v-8z",
  calc: "M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01",
  clock: "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  insight: "M3 17l6-6 4 4 8-8M15 7h6v6",
  report: "M5 3h14v18H5zM9 8h6M9 12h6M9 16h3",
  play: "M8 5v14l11-7z",
  pause: "M8 5v14M16 5v14",
  refresh: "M20 11a8 8 0 10-2.3 5.7M20 5v6h-6",
  alert: "M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  linkedin: "M6 9v9M6 6v.01M10 18v-5.5a2.5 2.5 0 015 0V18M10 9v9",
  github:
    "M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 00-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  plus: "M12 5v14M5 12h14",
  copy: "M8 8h12v12H8zM4 16V4h12",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} fill={name === "play" ? "currentColor" : "none"} />
    </svg>
  );
}
