import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// The build inlines all JS and CSS into one HTML file, so the site can be
// opened directly or dropped onto any static host.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { target: "es2020", cssCodeSplit: false },
});
