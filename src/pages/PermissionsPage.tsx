import { usePlugin } from "@opencode/plugin/tui";
import type { PanelInput } from "@opencode/plugin/tui/context";

// export function PermissionsPage() {
//   const ctx = usePlugin();
//   return <text>Project</text>;
// }

function ReviewPanel(props: { panel: PanelInput }) {
  return <text>Reviewing {props.panel.sessionID}</text>;
}

type PermissionsPageProps = {
  sessionID?: string;
};

export function PermissionsPage({ sessionID }: PermissionsPageProps) {
  const context = usePlugin();

  context.keymap.layer(() => ({
    mode: "global",
    enabled: true,
    commands: [
      {
        id: "permission.ui.close",
        title: "Exit Permission UI",
        group: "Permission UI",
        palette: true,
        bind: "esc",
        run: async () =>
          context.ui.router.navigate(
            sessionID
              ? { type: "session", sessionID: sessionID }
              : { type: "home" },
          ),
      },
    ],
  }));

  return <box border padding={2}></box>;
}
