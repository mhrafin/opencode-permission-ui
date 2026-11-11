import { usePlugin } from "@opencode/plugin/tui";
import type { PanelInput, Route } from "@opencode/plugin/tui/context";



type PermissionsPageProps = {
  returnRoute?: Route | undefined;
};

export function PermissionsPage({ returnRoute }: PermissionsPageProps) {
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
          context.ui.router.navigate(returnRoute ?? { type: "home" }),
      },
    ],
  }));

  return <box border padding={2}></box>;
}
