import { Plugin } from "@opencode/plugin/tui";
import { PermissionsPage } from "./pages/PermissionsPage.jsx";

export default Plugin.define({
  id: "permission.ui",
  setup(context) {
    const currentRoute = context.ui.router.current();
    const sessionID =
      currentRoute?.type === "session" ? currentRoute.sessionID : "";

    const unregister = context.ui.router.register({
      name: "permission.ui",
      render: () => <PermissionsPage sessionID={sessionID} />,
    });

    context.ui.toast.show({
      message: "Opencode Permission TUI plugin loaded",
      variant: "success",
    });

    context.keymap.layer(() => ({
      mode: "global",
      enabled: true,
      commands: [
        {
          id: "permission.ui.open",
          title: "Manage saved permissions",
          group: "Permission UI",
          slash: { name: "permissions" },
          run: async () =>
            context.ui.router.navigate({
              type: "plugin",
              name: "permission.ui",
            }),
        },
      ],
    }));

    return unregister;
  },
});
