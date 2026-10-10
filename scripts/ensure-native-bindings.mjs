// Some npm versions (notably 10.x on Windows) fail to install transitive
// *optional* native bindings (npm/cli#4828). Without them Vite's config loader
// crashes. This script detects the missing binding for the current platform and
// installs it explicitly. Wired to `predev` and `prebuild` so both `npm run dev`
// and CI self-heal. Run manually with: node scripts/ensure-native-bindings.mjs
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const platformKey = (() => {
  const { platform, arch } = process;
  if (platform === "win32" && arch === "x64") return "win32-x64-msvc";
  if (platform === "win32" && arch === "arm64") return "win32-arm64-msvc";
  if (platform === "darwin" && arch === "arm64") return "darwin-arm64";
  if (platform === "darwin" && arch === "x64") return "darwin-x64";
  if (platform === "linux" && arch === "x64") return "linux-x64-gnu";
  if (platform === "linux" && arch === "arm64") return "linux-arm64-gnu";
  return null;
})();

if (!platformKey) {
  console.log("ensure-native-bindings: unsupported platform, skipping");
  process.exit(0);
}

// Packages whose optional native binding is required at build/dev time.
const PACKAGES = ["rolldown", "oxc-parser"];
const missing = [];

for (const name of PACKAGES) {
  const pkgPath = path.join(process.cwd(), "node_modules", name, "package.json");
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  for (const [dep, version] of Object.entries(pkg.optionalDependencies || {})) {
    if (!dep.endsWith(platformKey)) continue;
    if (!fs.existsSync(path.join(process.cwd(), "node_modules", ...dep.split("/")))) {
      missing.push(`${dep}@${version}`);
    }
  }
}

if (missing.length === 0) {
  console.log("ensure-native-bindings: ✓ all native bindings present");
  process.exit(0);
}

console.log(`ensure-native-bindings: installing ${missing.join(", ")}`);
try {
  execSync(`npm install --no-save --no-audit --no-fund ${missing.map((m) => `"${m}"`).join(" ")}`, {
    stdio: "inherit",
  });
} catch (err) {
  // Never fail the whole build because of this optional self-heal step.
  console.warn("ensure-native-bindings: install failed, continuing:", err?.message ?? err);
}
