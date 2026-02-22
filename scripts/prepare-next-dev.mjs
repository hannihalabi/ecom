import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const nextDir = path.join(process.cwd(), ".next");
const lockPath = path.join(nextDir, "lock");
const devDir = path.join(nextDir, "dev");

if (existsSync(lockPath)) {
  const lsofResult = spawnSync("lsof", ["-t", lockPath], { encoding: "utf8" });
  const pids = lsofResult.stdout
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (pids.length > 0) {
    const uniquePids = [...new Set(pids)];
    console.error(
      `[dev-lock] ${lockPath} is currently in use by PID(s): ${uniquePids.join(", ")}.`,
    );
    console.error("[dev-lock] Stop that process first, then run npm run dev again.");
    process.exit(1);
  }

  rmSync(lockPath, { force: true });
  console.warn(`[dev-lock] Removed stale lock file: ${lockPath}`);
}

if (existsSync(devDir)) {
  rmSync(devDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 75,
  });
  console.warn(`[dev-cache] Cleared stale dev cache: ${devDir}`);
}
