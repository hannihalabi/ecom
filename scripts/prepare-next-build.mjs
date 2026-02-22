import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const lockPath = path.join(process.cwd(), ".next", "lock");

if (!existsSync(lockPath)) {
  process.exit(0);
}

const lsofResult = spawnSync("lsof", ["-t", lockPath], { encoding: "utf8" });
const pids = lsofResult.stdout
  .split(/\s+/)
  .map((value) => value.trim())
  .filter(Boolean);

if (pids.length > 0) {
  const uniquePids = [...new Set(pids)];
  console.error(
    `[build-lock] ${lockPath} is currently in use by PID(s): ${uniquePids.join(", ")}.`,
  );
  console.error("[build-lock] Stop that process first, then run npm run build again.");
  process.exit(1);
}

rmSync(lockPath, { force: true });
console.warn(`[build-lock] Removed stale lock file: ${lockPath}`);
