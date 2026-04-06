export type ToastTone = "success" | "info" | "warning" | "error";

export type ToastRoute = "home" | "docs" | "dashboard" | "palette";

export type ToastAction =
  | "open_repository"
  | "open_docs"
  | "open_pypi"
  | "open_detectors"
  | "open_dashboard"
  | "open_scoring"
  | "copy_command"
  | "copy_failed"
  | "open_home"
  | "open_quick_start"
  | "open_ci_cd"
  | "action_failed";

const routeToastRules: Record<ToastRoute, Partial<Record<ToastAction, { message: string; tone: ToastTone }>>> = {
  home: {
    copy_command: { message: "Command copied", tone: "success" },
    copy_failed: { message: "Clipboard access blocked", tone: "warning" },
    open_docs: { message: "Opening quick start", tone: "info" },
  },
  docs: {
    open_repository: { message: "Opened repository", tone: "success" },
    open_docs: { message: "Opened DeepWiki docs", tone: "success" },
    open_pypi: { message: "Opened PyPI package", tone: "success" },
    open_detectors: { message: "Opening detector catalog", tone: "info" },
    open_dashboard: { message: "Opening live metrics", tone: "info" },
  },
  dashboard: {
    open_scoring: { message: "Opening scoring policy", tone: "info" },
    open_detectors: { message: "Opening detector catalog", tone: "info" },
  },
  palette: {
    open_home: { message: "Opening home", tone: "info" },
    open_docs: { message: "Opening docs", tone: "info" },
    open_quick_start: { message: "Opening quick start", tone: "info" },
    open_ci_cd: { message: "Opening CI/CD guide", tone: "info" },
    open_detectors: { message: "Opening detector catalog", tone: "info" },
    open_dashboard: { message: "Opening live metrics", tone: "info" },
    open_repository: { message: "Opened repository", tone: "success" },
    open_pypi: { message: "Opened PyPI package", tone: "success" },
    action_failed: { message: "Action failed", tone: "error" },
  },
};

export function resolveToast(route: ToastRoute, action: ToastAction) {
  return routeToastRules[route][action] ?? { message: "Done", tone: "info" as ToastTone };
}
