import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = process.cwd();
const composeFile = resolve(rootDir, "infra", "docker-compose.yml");
const setupOnly = process.argv.includes("--setup-only");

if (!existsSync(composeFile)) {
  console.error(`Compose dosyası bulunamadı: ${composeFile}`);
  process.exit(1);
}

function resolveCommand(command) {
  return command;
}

function quoteForCmd(arg) {
  if (!arg.includes(" ") && !arg.includes('"')) {
    return arg;
  }
  return `"${arg.replaceAll('"', '\\"')}"`;
}

function runStep(command, args, options = {}) {
  const isWindowsPnpm = process.platform === "win32" && command === "pnpm";
  const executable = isWindowsPnpm ? "cmd.exe" : resolveCommand(command);
  const executableArgs = isWindowsPnpm
    ? ["/d", "/s", "/c", `pnpm ${args.map(quoteForCmd).join(" ")}`]
    : args;
  const printable = `${command} ${args.join(" ")}`.trim();
  console.log(`\n> ${printable}`);

  const result = spawnSync(executable, executableArgs, {
    cwd: rootDir,
    encoding: "utf8"
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    if (options.allowFailure?.(result)) {
      console.warn(options.warningMessage ?? "Adım uyarı ile geçildi.");
      return;
    }
    process.exit(result.status ?? 1);
  }
}

runStep("docker", ["compose", "-f", composeFile, "up", "-d", "postgres", "redis"]);
runStep("pnpm", ["db:generate"], {
  allowFailure: (result) =>
    typeof result.stderr === "string" &&
    result.stderr.includes("query_engine-windows.dll.node.tmp") &&
    result.stderr.includes("EPERM"),
  warningMessage:
    "db:generate adımı, dosya kilidi (EPERM) nedeniyle atlandı. Açık Node süreçlerini kapatıp yeniden çalıştırabilirsiniz."
});
runStep("pnpm", [
  "--filter",
  "@dadi-kapida/database",
  "exec",
  "prisma",
  "migrate",
  "dev",
  "--name",
  "init",
  "--skip-generate"
]);
runStep("pnpm", ["db:seed"]);

if (setupOnly) {
  console.log("\nKurulum adımları tamamlandı (`--setup-only`).");
  process.exit(0);
}

console.log("\n> pnpm dev");

const devProcess =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/s", "/c", "pnpm dev"], {
        cwd: rootDir,
        stdio: "inherit"
      })
    : spawn(resolveCommand("pnpm"), ["dev"], {
        cwd: rootDir,
        stdio: "inherit"
      });

devProcess.on("exit", (code) => {
  process.exit(code ?? 0);
});
