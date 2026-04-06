export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export type Detector = {
  key: string;
  severity: Severity;
  title: string;
  description: string;
  category: "Security" | "Logic" | "Best Practice";
};

export const projectFacts = {
  name: "Vyper Guard",
  tagline: "Vyper-native smart contract security CLI",
  pypiVersion: "0.3.4",
  releaseDate: "2026-03-24",
  python: ">=3.10",
  license: "MIT",
  repository: "https://github.com/preethamak/vyper",
  docs: "https://deepwiki.com/preethamak/vyper",
  pypi: "https://pypi.org/project/vyper-guard",
};

export const commands = [
  {
    command: "vyper-guard analyze contracts/Vault.vy",
    description: "Run full deterministic static analysis and produce risk-scored findings.",
  },
  {
    command: "vyper-guard analyze contracts/Vault.vy --ai",
    description: "Add AI-assisted prioritization and remediation narrative on top of deterministic findings.",
  },
  {
    command: "vyper-guard ast contracts/Vault.vy --format json",
    description: "Inspect declarations and contract structure through an AST summary.",
  },
  {
    command: "vyper-guard flow contracts/Vault.vy --format mermaid",
    description: "Generate function and call-flow views for reasoning about execution order.",
  },
  {
    command: "vyper-guard fix contracts/Vault.vy --fix-dry-run --max-auto-fix-tier B",
    description: "Preview safe remediations with tier-based safety gates.",
  },
  {
    command: "vyper-guard stats contracts/Vault.vy --graph",
    description: "Export analysis metrics with graph artifacts (JSON + HTML).",
  },
  {
    command: "vyper-guard analyze-address 0xYourAddress --format json",
    description: "Analyze deployed contract source via explorer-backed lookup.",
  },
] as const;

export const detectors: Detector[] = [
  {
    key: "missing_nonreentrant",
    severity: "CRITICAL",
    title: "Missing Reentrancy Guard",
    description: "External value transfer paths missing @nonreentrant protection.",
    category: "Security",
  },
  {
    key: "unprotected_selfdestruct",
    severity: "CRITICAL",
    title: "Unprotected Selfdestruct",
    description: "selfdestruct() without explicit authorization checks.",
    category: "Security",
  },
  {
    key: "cei_violation",
    severity: "HIGH",
    title: "Checks-Effects-Interactions Violation",
    description: "External call occurs before internal state update.",
    category: "Logic",
  },
  {
    key: "unsafe_raw_call",
    severity: "HIGH",
    title: "Unsafe raw_call Usage",
    description: "raw_call() return value or behavior is not validated.",
    category: "Security",
  },
  {
    key: "dangerous_delegatecall",
    severity: "HIGH",
    title: "Dangerous Delegatecall",
    description: "Delegate call is used with untrusted target/data.",
    category: "Security",
  },
  {
    key: "unprotected_state_change",
    severity: "HIGH",
    title: "Unprotected State Change",
    description: "Sensitive state writes lack robust sender authorization.",
    category: "Security",
  },
  {
    key: "integer_overflow",
    severity: "HIGH",
    title: "Integer Overflow Risk",
    description: "Unsafe arithmetic primitives can overflow or underflow.",
    category: "Logic",
  },
  {
    key: "send_in_loop",
    severity: "HIGH",
    title: "Value Transfer in Loop",
    description: "Value transfer inside loops can trigger DoS-like behavior.",
    category: "Security",
  },
  {
    key: "unchecked_subtraction",
    severity: "HIGH",
    title: "Unchecked Subtraction",
    description: "Subtraction path lacks defensive bound checks.",
    category: "Logic",
  },
  {
    key: "compiler_version_check",
    severity: "MEDIUM",
    title: "Compiler Advisory Risk",
    description: "Compiler version intersects with known vulnerability advisories.",
    category: "Best Practice",
  },
  {
    key: "missing_event_emission",
    severity: "LOW",
    title: "Missing Event Emission",
    description: "State-changing functions do not emit observable events.",
    category: "Best Practice",
  },
  {
    key: "timestamp_dependence",
    severity: "LOW",
    title: "Timestamp Dependence",
    description: "Business logic relies on block.timestamp for critical decisions.",
    category: "Best Practice",
  },
];

export const severityPenalty = {
  CRITICAL: { penalty: -40, cap: -80 },
  HIGH: { penalty: -20, cap: -60 },
  MEDIUM: { penalty: -8, cap: -24 },
  LOW: { penalty: -3, cap: -9 },
  INFO: { penalty: -1, cap: -5 },
};

export const gradeScale = [
  { min: 90, max: 100, grade: "A+", recommendation: "Production ready" },
  { min: 75, max: 89, grade: "A", recommendation: "Minor fixes" },
  { min: 60, max: 74, grade: "B", recommendation: "Review required" },
  { min: 45, max: 59, grade: "C", recommendation: "Major fixes required" },
  { min: 0, max: 44, grade: "F", recommendation: "Do not deploy" },
] as const;

export const documentationSections = [
  {
    id: "why",
    title: "Why teams keep Vyper Guard in CI",
    content:
      "Teams adopt Vyper Guard because it behaves the same in local runs and in CI. That consistency cuts review noise, shortens triage, and makes release decisions easier to defend.",
    bullets: [
      "Deterministic output keeps triage stable",
      "Severity policy stays consistent from PR to release",
      "Fix planning remains reviewer-led",
      "Address analysis supports post-deploy verification",
    ],
  },
  {
    id: "analysis",
    title: "How a scan executes",
    content:
      "Each scan follows one clear pipeline: input checks, detector execution, semantic validation, and score synthesis. You can compare results between commits without guessing what changed.",
    bullets: [
      "Input guardrails reject empty or comment-only files",
      "Pattern + semantic checks reduce false positives",
      "Severity penalties map cleanly to deployment risk",
      "CLI, JSON, and Markdown outputs remain consistent",
    ],
  },
  {
    id: "fix",
    title: "Remediation controls",
    content:
      "Remediation is intentionally conservative. Start with preview mode, set an automation tier, and keep fix plans as review artifacts before applying changes.",
    bullets: [
      "`--fix-dry-run` previews changes with zero writes",
      "`--max-auto-fix-tier` limits automation scope",
      "JSON fix plans plug into approval workflows",
    ],
  },
  {
    id: "ops",
    title: "Operational rollout",
    content:
      "Roll out in phases: local developer checks first, PR gates next, then release policy enforcement. The same command set works across all stages.",
    bullets: [
      "Use severity thresholds to fail unsafe builds",
      "Run address scans against deployed contracts",
      "Generate stats/graphs for audit reporting",
    ],
  },
] as const;

export const navLinks = [
  { href: "/", label: "Experience" },
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
