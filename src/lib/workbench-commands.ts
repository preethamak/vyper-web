export type PresetId =
  | "analyze"
  | "analyze-ai"
  | "ast-json"
  | "flow-mermaid"
  | "fix-dry-run"
  | "stats-graph"
  | "analyze-address"
  | "explorer";

export type CommandInput = "source" | "address" | "none";

export type WorkbenchCommand = {
  id: string;
  label: string;
  command: string;
  description: string;
  runnable: boolean;
  input: CommandInput;
  preset?: PresetId;
};

export const workbenchCommands: WorkbenchCommand[] = [
  {
    id: "analyze",
    label: "Analyze",
    command: "vyper-guard analyze contracts/Vault.vy",
    description: "Run deterministic static analysis and produce scored findings.",
    runnable: true,
    input: "source",
    preset: "analyze",
  },
  {
    id: "analyze-ai",
    label: "Analyze + AI",
    command: "vyper-guard analyze contracts/Vault.vy --ai",
    description: "Run deterministic analysis with AI-assisted prioritization.",
    runnable: true,
    input: "source",
    preset: "analyze-ai",
  },
  {
    id: "ast-json",
    label: "AST JSON",
    command: "vyper-guard ast contracts/Vault.vy --format json",
    description: "Render AST output for machine-readable structure inspection.",
    runnable: true,
    input: "source",
    preset: "ast-json",
  },
  {
    id: "flow-mermaid",
    label: "Flow Mermaid",
    command: "vyper-guard flow contracts/Vault.vy --format mermaid",
    description: "Generate flow output suited for diagram/render pipelines.",
    runnable: true,
    input: "source",
    preset: "flow-mermaid",
  },
  {
    id: "fix-dry-run",
    label: "Fix Dry Run",
    command: "vyper-guard fix contracts/Vault.vy --fix-dry-run --max-auto-fix-tier B",
    description: "Preview remediation plan without applying file writes.",
    runnable: true,
    input: "source",
    preset: "fix-dry-run",
  },
  {
    id: "stats-graph",
    label: "Stats Graph",
    command: "vyper-guard stats contracts/Vault.vy --graph",
    description: "Export score/severity stats and report graph artifacts.",
    runnable: true,
    input: "source",
    preset: "stats-graph",
  },
  {
    id: "analyze-address",
    label: "Analyze Address",
    command: "vyper-guard analyze-address 0xYourAddress --format json",
    description: "Run explorer-backed analysis for deployed contract address.",
    runnable: true,
    input: "address",
    preset: "analyze-address",
  },
  {
    id: "explorer",
    label: "Explorer",
    command: "vyper-guard explorer 0xYourAddress --format json",
    description: "Fetch explorer intelligence payload for an address.",
    runnable: true,
    input: "address",
    preset: "explorer",
  },
  {
    id: "ai-config-provider",
    label: "AI Config Provider",
    command: "vyper-guard ai config set provider openai",
    description: "Configure AI provider for assistant mode (reference in web UI).",
    runnable: false,
    input: "none",
  },
  {
    id: "ai-config-model",
    label: "AI Config Model",
    command: "vyper-guard ai config set model gpt-5.3-codex",
    description: "Set AI model for assistive reports (reference in web UI).",
    runnable: false,
    input: "none",
  },
  {
    id: "ai-config-show",
    label: "AI Config Show",
    command: "vyper-guard ai config show",
    description: "Show AI config values from current environment profile.",
    runnable: false,
    input: "none",
  },
  {
    id: "explorer-config-provider",
    label: "Explorer Config Provider",
    command: "vyper-guard explorer config set provider auto",
    description: "Configure explorer backend provider (reference in web UI).",
    runnable: false,
    input: "none",
  },
  {
    id: "explorer-config-show",
    label: "Explorer Config Show",
    command: "vyper-guard explorer config show",
    description: "Show explorer config values from current environment profile.",
    runnable: false,
    input: "none",
  },
  {
    id: "version",
    label: "Version",
    command: "vyper-guard --version",
    description: "Display CLI version (reference in web UI).",
    runnable: false,
    input: "none",
  },
  {
    id: "help",
    label: "Help",
    command: "vyper-guard --help",
    description: "Display help and command usage (reference in web UI).",
    runnable: false,
    input: "none",
  },
];

export const runnablePresets = workbenchCommands
  .filter((command) => command.runnable && command.preset)
  .map((command) => ({ id: command.id, preset: command.preset as PresetId, input: command.input }));
