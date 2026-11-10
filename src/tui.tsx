import { Plugin } from "@opencode/plugin/tui";

export default Plugin.define({
  id: "permission.ui",
  setup(context) {
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
          slash: { name: "permissions" },
          run: async () => context.ui.toast.show({ message: "Ready" }),
        },
      ],
    }));
  },
});
