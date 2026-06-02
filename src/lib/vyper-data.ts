export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type DetectorConfidence = "HIGH" | "MEDIUM" | "LOW" | "HIGH/MEDIUM";
export type DetectorAutoFix = "FULL" | "PARTIAL" | "ADVISORY";
export type ExampleScanResult = {
  name: string;
  source: string;
  score: number;
  grade: "A+" | "A" | "B" | "C" | "F";
  findings: number;
  CRITICAL: number;
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  INFO: number;
};

export type Detector = {
  key: string;
  severity: Severity;
  title: string;
  description: string;
  confidence: DetectorConfidence;
  smartSuppression: boolean;
  autoFix: DetectorAutoFix;
  dynamicSeverity: boolean;
  category:
    | "Reentrancy"
    | "External Call"
    | "Code Quality"
    | "Timestamp"
    | "Arithmetic"
    | "Self-Destruct"
    | "Delegate Call"
    | "Access Control"
    | "Denial of Service"
    | "Input Validation"
    | "Compiler Bug";
};

export const projectFacts = {
  name: "Vyper Guard",
  tagline: "Lightweight static security analyzer for Vyper smart contracts",
  pypiVersion: "0.3.6",
  releaseDate: "2026-04-18",
  python: ">=3.10",
  license: "MIT",
  repository: "https://github.com/preethamak/vyper",
  docs: "https://deepwiki.com/preethamak/vyper",
  pypi: "https://pypi.org/project/vyper-guard",
};

export const commands = [
  {
    command: "vyper-guard analyze contract.vy",
    description: "Run deterministic static analysis for a single contract file.",
  },
  {
    command: "vyper-guard analyze contract.vy --format json --output report.json",
    description: "Export machine-readable findings for CI and automation workflows.",
  },
  {
    command: "vyper-guard analyze contract.vy --ai-triage --ai-triage-mode llm --allow-ai-fallback",
    description: "Add advisory AI triage metadata without changing deterministic verdicts.",
  },
  {
    command: "vyper-guard analyze contract.vy --fix-dry-run --max-auto-fix-tier B --fix-report remediation-report.json",
    description: "Preview remediation safely and export a deterministic fix-plan report.",
  },
  {
    command: "vyper-guard ast contract.vy --format json",
    description: "Export parsed contract structure and metadata for machine processing.",
  },
  {
    command: "vyper-guard flow contract.vy --format mermaid",
    description: "Render function/call-flow summaries for architecture review.",
  },
  {
    command: "vyper-guard stats contract.vy --graph",
    description: "Generate structural metrics plus JSON/HTML graph artifacts.",
  },
  {
    command: "vyper-guard analyze-address 0xYourContractAddress --format json",
    description: "Analyze a deployed contract from explorer-verified source and metadata.",
  },
  {
    command: "vyper-guard explorer 0xYourContractAddress --provider auto --format json",
    description: "Fetch verified source, ABI, and contract metadata from explorer providers.",
  },
  {
    command: "vyper-guard agent \"Summarize top risks\" --file contract.vy",
    description: "Run LLM-backed advisory agent mode with optional memory and sandbox context.",
  },
  {
    command: "vyper-guard monitor 0xYourContractAddress --rpc https://rpc.url",
    description: "Run optional live monitoring for deployed contract behavior anomalies.",
  },
  {
    command: "vyper-guard baseline 0xYourContractAddress --rpc https://rpc.url --duration 300 --output baseline.json",
    description: "Create behavioral baseline data for anomaly-aware monitoring.",
  },
  {
    command: "vyper-guard detectors",
    description: "List detector inventory and metadata in the CLI.",
  },
  {
    command: "vyper-guard benchmark ./contracts --format json --min-f1 0.70",
    description: "Run detector-quality benchmark gates on a labeled contract corpus.",
  },
] as const;

export const detectors: Detector[] = [
  {
    key: "missing_nonreentrant",
    severity: "CRITICAL",
    title: "Missing @nonreentrant",
    description: "Flags external value transfer paths without reentrancy guard (can downgrade with strong access control).",
    confidence: "HIGH/MEDIUM",
    smartSuppression: true,
    autoFix: "FULL",
    dynamicSeverity: true,
    category: "Reentrancy",
  },
  {
    key: "unsafe_raw_call",
    severity: "HIGH",
    title: "Unsafe raw_call",
    description: "Detects raw_call usage without robust return-value checks.",
    confidence: "MEDIUM",
    smartSuppression: true,
    autoFix: "FULL",
    dynamicSeverity: false,
    category: "External Call",
  },
  {
    key: "missing_event_emission",
    severity: "LOW",
    title: "Missing Event Emission",
    description: "State-changing external functions with no event emission for observability.",
    confidence: "MEDIUM",
    smartSuppression: false,
    autoFix: "FULL",
    dynamicSeverity: false,
    category: "Code Quality",
  },
  {
    key: "timestamp_dependence",
    severity: "LOW",
    title: "Timestamp Dependence",
    description: "Finds short-window logic dependent on block.timestamp (timelock contexts are suppressed).",
    confidence: "MEDIUM",
    smartSuppression: true,
    autoFix: "ADVISORY",
    dynamicSeverity: false,
    category: "Timestamp",
  },
  {
    key: "integer_overflow",
    severity: "HIGH",
    title: "Unsafe Arithmetic",
    description: "Detects unsafe_* arithmetic usage that bypasses Vyper overflow protections.",
    confidence: "HIGH",
    smartSuppression: true,
    autoFix: "PARTIAL",
    dynamicSeverity: false,
    category: "Arithmetic",
  },
  {
    key: "unprotected_selfdestruct",
    severity: "CRITICAL",
    title: "Unprotected selfdestruct",
    description: "Detects selfdestruct paths without explicit authorization checks.",
    confidence: "HIGH",
    smartSuppression: false,
    autoFix: "FULL",
    dynamicSeverity: false,
    category: "Self-Destruct",
  },
  {
    key: "dangerous_delegatecall",
    severity: "HIGH",
    title: "Dangerous delegatecall",
    description: "Flags delegatecall patterns that may escalate to critical risk when unguarded.",
    confidence: "HIGH/MEDIUM",
    smartSuppression: false,
    autoFix: "FULL",
    dynamicSeverity: true,
    category: "Delegate Call",
  },
  {
    key: "unprotected_state_change",
    severity: "HIGH",
    title: "Unprotected State Change",
    description: "Sensitive state writes without sufficient access control validation.",
    confidence: "HIGH",
    smartSuppression: false,
    autoFix: "FULL",
    dynamicSeverity: false,
    category: "Access Control",
  },
  {
    key: "send_in_loop",
    severity: "HIGH",
    title: "Value Transfer in Loop",
    description: "send/raw_call inside loops that can cause denial-of-service behavior.",
    confidence: "HIGH",
    smartSuppression: true,
    autoFix: "ADVISORY",
    dynamicSeverity: false,
    category: "Denial of Service",
  },
  {
    key: "unchecked_subtraction",
    severity: "HIGH",
    title: "Unchecked Subtraction",
    description: "State subtraction paths missing clear precondition/underflow guards.",
    confidence: "MEDIUM",
    smartSuppression: true,
    autoFix: "FULL",
    dynamicSeverity: false,
    category: "Input Validation",
  },
  {
    key: "cei_violation",
    severity: "HIGH",
    title: "CEI Violation",
    description: "External interaction occurs before state effects (Checks-Effects-Interactions violation).",
    confidence: "HIGH",
    smartSuppression: false,
    autoFix: "ADVISORY",
    dynamicSeverity: false,
    category: "Reentrancy",
  },
  {
    key: "compiler_version_check",
    severity: "HIGH",
    title: "Compiler Version Advisory",
    description: "Checks pragma against known Vyper compiler advisories (HIGH/INFO depending on context).",
    confidence: "HIGH",
    smartSuppression: true,
    autoFix: "FULL",
    dynamicSeverity: true,
    category: "Compiler Bug",
  },
];

export const severityPenalty = {
  CRITICAL: { penalty: -40, cap: -50 },
  HIGH: { penalty: -20, cap: -40 },
  MEDIUM: { penalty: -8, cap: -20 },
  LOW: { penalty: -3, cap: -10 },
  INFO: { penalty: -1, cap: -5 },
};

export const failedDetectorPenalty = { penalty: -10, cap: -30 };

export const gradeScale = [
  { min: 90, max: 100, grade: "A+", recommendation: "Production ready" },
  { min: 75, max: 89, grade: "A", recommendation: "Minor fixes" },
  { min: 60, max: 74, grade: "B", recommendation: "Review required" },
  { min: 45, max: 59, grade: "C", recommendation: "Major fixes required" },
  { min: 0, max: 44, grade: "F", recommendation: "Do not deploy" },
] as const;

export const documentationSections = [
  {
    id: "deterministic",
    title: "Deterministic analysis core",
    content:
      "The core scanner is deterministic and file-scoped: parse source, run compiler checks and detectors, then score and grade. This keeps CI decisions reproducible.",
    bullets: [
      "Single-file analysis boundary for `analyze <file>`",
      "12 built-in checks including compiler advisories",
      "Structured CLI, JSON, and Markdown reporting",
      "Stable score/grade model with per-tier deduction caps",
    ],
  },
  {
    id: "advisory",
    title: "Advisory AI and remediation",
    content:
      "AI triage is optional and advisory. It augments prioritization metadata but cannot override detector verdicts. Remediation runs through explicit safety tiers.",
    bullets: [
      "`--ai-triage` adds metadata, not verdict changes",
      "`--allow-ai-fallback` is explicit opt-in",
      "`--fix-dry-run` previews edits before writes",
      "`--max-auto-fix-tier` enforces risk boundaries",
    ],
  },
  {
    id: "deployed",
    title: "Deployed-contract workflows",
    content:
      "Explorer and address analysis extend checks to deployed contracts. Agent mode and monitoring support investigation and runtime operations.",
    bullets: [
      "`explorer` fetches source/ABI/metadata",
      "`analyze-address` evaluates verified source",
      "`agent` provides LLM-backed advisory assistance",
      "`monitor` / `baseline` support runtime anomaly workflows",
    ],
  },
  {
    id: "limits",
    title: "Known boundaries and hardening",
    content:
      "Vyper Guard is one layer in a defense-in-depth workflow. It does not replace formal verification, protocol-level threat modeling, or professional audits.",
    bullets: [
      "Cross-contract and protocol-economic attacks are out of scope",
      "Detector runtime failures apply trust penalties to scoring",
      "Config discovery is trust-boundary hardened",
      "Production use still requires manual review and testing",
    ],
  },
] as const;

export const navLinks = [
  { href: "/", label: "Experience" },
  { href: "/workbench", label: "Workbench" },
  { href: "/docs", label: "Documentation" },
  { href: "/detectors", label: "Detectors" },
  { href: "/dashboard", label: "Live Metrics" },
];

export const severityCounts = detectors.reduce<Record<Severity, number>>(
  (acc, detector) => {
    acc[detector.severity] += 1;
    return acc;
  },
  {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    INFO: 0,
  },
);

export const detectorConfidenceCounts = detectors.reduce<Record<DetectorConfidence, number>>(
  (acc, detector) => {
    acc[detector.confidence] += 1;
    return acc;
  },
  {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    "HIGH/MEDIUM": 0,
  },
);

export const detectorCapabilitySummary = {
  total: detectors.length,
  smartSuppression: detectors.filter((detector) => detector.smartSuppression).length,
  dynamicSeverity: detectors.filter((detector) => detector.dynamicSeverity).length,
  autoFixFull: detectors.filter((detector) => detector.autoFix === "FULL").length,
  autoFixPartial: detectors.filter((detector) => detector.autoFix === "PARTIAL").length,
  autoFixAdvisory: detectors.filter((detector) => detector.autoFix === "ADVISORY").length,
};

export const exampleScanProvenance = {
  generatedAt: "2026-04-20",
  generatorVersion: "vyper-guard 0.3.6",
  command: "vyper-guard analyze <contract> --format json",
  sourceRepo: "https://github.com/preethamak/vyper/tree/main/docs/examples",
};

export const exampleScanResults: ExampleScanResult[] = [
  {
    name: "safe_vault",
    source: "docs/examples/safe_vault.vy",
    score: 80,
    grade: "A",
    findings: 1,
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 0,
    LOW: 0,
    INFO: 0,
  },
  {
    name: "token",
    source: "docs/examples/token.vy",
    score: 57,
    grade: "C",
    findings: 4,
    CRITICAL: 0,
    HIGH: 3,
    MEDIUM: 0,
    LOW: 1,
    INFO: 0,
  },
  {
    name: "vulnerable_vault",
    source: "docs/examples/vulnerable_vault.vy",
    score: 0,
    grade: "F",
    findings: 15,
    CRITICAL: 3,
    HIGH: 6,
    MEDIUM: 2,
    LOW: 4,
    INFO: 0,
  },
];
