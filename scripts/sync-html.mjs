// Copies the single-file build to "Cyber Panther.html" in the project root so
// the file can still be opened directly, as before.
import { copyFileSync } from "node:fs";
copyFileSync("dist/index.html", "Cyber Panther.html");
console.log("Synced dist/index.html -> Cyber Panther.html");
