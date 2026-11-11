import { Plugin } from "@opencode/plugin/tui";
import type { Route } from "@opencode/plugin/tui/context";
import { PermissionsPage } from "./pages/PermissionsPage.jsx";

function snapshotRoute(route: Route): Route {
  if (route.type === "home") return { type: "home" };
  if (route.type === "session")
    return { type: "session", sessionID: route.sessionID };
  return {
    type: "plugin",
    id: route.id,
    name: route.name,
    ...(route.data ? { data: { ...route.data } } : {}),
  };
}

export default Plugin.define({
  id: "permission.ui.id",
  setup(context) {
    const currentRoute = context.ui.router.current();
    const sessionID =
      currentRoute?.type === "session" ? currentRoute.sessionID : undefined;

    const unregister = context.ui.router.register({
      name: "permission.ui.name",
      render: ({ data: data }) => (
        <PermissionsPage returnRoute={data?.returnRoute} />
      ),
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
          run: async () => {
            const route = context.ui.router.current();

            if (route.type === "plugin" && route.name === "permission.ui.name")
              return;

            context.ui.router.navigate({
              type: "plugin",
              name: "permission.ui.name",
              data: {
                returnRoute: snapshotRoute(route),
              },
            });
          },
        },
      ],
    }));

    return unregister;
  },
});
