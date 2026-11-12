# opencode-permission-ui

[![OpenCode TUI plugin](https://img.shields.io/badge/opencode-TUI_plugin-8A2BE2)](https://opencode.ai/docs/build/plugins/cli/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![Tests](https://img.shields.io/badge/tests-vitest-6E9F18?logo=vitest&logoColor=white)](tests/PermissionsPage.test.ts)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contributing)

A [TUI plugin](https://opencode.ai/docs/build/plugins/cli/) for [OpenCode](https://opencode.ai) that adds a keyboard-driven screen for managing the permissions you've saved with **"Allow always"**.

Every time OpenCode asks for permission to run a tool and you answer "Allow always", a rule is saved for that project. Those rules accumulate silently, this plugin gives you one place to review, refresh, and prune them without digging through server state.

## Why it's useful

- **See every saved rule** — browse all "Allow always" permissions scoped to a project, with the selected rule's ID shown for reference
- **Project switcher** — preselects the project matching the directory you launched OpenCode from; press `p` to jump to another project
- **Safe deletion** — press `ctrl+d` once to arm (the row highlights in destructive colors and reads _"Press [ctrl + d] again to delete"_), press again to delete. Moving the selection disarms, so you can't delete the wrong row by accident
- **Refresh on demand** — press `r` to re-sync the project list and the selected project's permissions
- **Non-destructive navigation** — opening the screen remembers where you were; `esc` returns you to that exact route
- **Theme-aware** — all colors come from OpenCode's theme tokens (text, borders, destructive action colors)
- **Slash command** — available everywhere in the TUI as `/permissions`

## Requirements

- An OpenCode install with TUI plugin support
- Node.js (with npm) to install from source

## Getting started

### Option 1: install from npm

Add the package to the CLI's `cli.json` in your global OpenCode config directory (typically `~/.config/opencode/cli.json`) — OpenCode fetches and loads it for you:

```jsonc
{
  "plugins": ["opencode-permission-ui"],
}
```

TUI-only plugins live in `cli.json` so they stay active even when the CLI connects to a remote server. Pin a version with `"opencode-permission-ui@0.1.0"` if you prefer. See the [OpenCode plugin docs](https://opencode.ai/docs/cli/plugins/) for all accepted entry formats.

### Option 2: install from source and register the path in `cli.json`

Clone and build dependencies, then point `cli.json` at the checkout:

```sh
git clone https://github.com/mhrafin/opencode-permission-ui.git
cd opencode-permission-ui
npm install
```

TUI-only plugins are configured in the CLI's `cli.json` in your global OpenCode config directory (typically `~/.config/opencode/cli.json`):

```jsonc
{
  "plugins": ["/absolute/path/to/opencode-permission-ui"],
}
```

Local paths must point at the package directory (this repo's root). See the [OpenCode plugin docs](https://opencode.ai/docs/cli/plugins/) for all accepted entry formats.

### Option 3: clone into the global plugins directory

OpenCode auto-discovers plugin packages under its global config directory, so you can drop the repo straight in:

```sh
git clone https://github.com/mhrafin/opencode-permission-ui.git \
  ~/.config/opencode/plugins/opencode-permission-ui
cd ~/.config/opencode/plugins/opencode-permission-ui
npm install
```

Restart OpenCode after installing from source. When the plugin loads you'll see the toast **"Opencode Permission TUI plugin loaded"**.

## Usage

Open the OpenCode TUI and run the slash command:

```text
/permissions
```

You'll land on the **Permission UI** screen listing the selected project's saved permissions.

| Key       | Action                                                      |
| --------- | ----------------------------------------------------------- |
| `↑` / `↓` | Move the selection (wraps at the ends)                      |
| `p`       | Change project (opens a select dialog)                      |
| `r`       | Refresh projects and the selected project's permissions     |
| `ctrl+d`  | Delete the selected permission — press **twice** to confirm |
| `esc`     | Back to the screen you came from                            |

A few things to know:

- Rules are scoped to the selected project — switching projects switches the list.
- Deleting a rule takes effect immediately and cannot be undone from the UI.

## How it works

The plugin is two small modules:

| File                                                             | Role                                                                                                                                                                                                |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`src/tui.tsx`](src/tui.tsx)                                     | Plugin entry (`Plugin.define`). Registers the route, the `/permissions` slash command, and snapshots your current route so `esc` can return you to it                                               |
| [`src/pages/PermissionsPage.tsx`](src/pages/PermissionsPage.tsx) | The screen itself — a [SolidJS](https://www.solidjs.com/) component that reads projects and saved permissions via `context.data.project.*` and deletes via `context.client.permission.saved.remove` |

It's built on [`@opencode/plugin/tui`](https://opencode.ai/docs/build/plugins/cli/) and renders with [OpenTUI](https://opentui.com) primitives (`box`, `text`, `select`).

## Development

```sh
npm install
npm run typecheck   # tsc --noEmit
npm run test        # vitest run
```

Project layout:

```text
src/
├── tui.tsx                    # plugin entry: route + slash command + keymap layer
└── pages/
    └── PermissionsPage.tsx    # the permissions screen
tests/
└── PermissionsPage.test.ts    # unit tests (vitest)
```

OpenTUI peers (`@opentui/core`, `@opentui/solid`, `solid-js`) are declared as peer dependencies: OpenCode provides them at runtime, and npm installs them locally for typechecking and tests.

## Getting help

- **OpenCode plugin docs** — [configuring plugins](https://opencode.ai/docs/plugins/) and [building TUI plugins](https://opencode.ai/docs/build/plugins/cli/)
- **OpenCode source code** — [anomalyco/opencode](https://github.com/anomalyco/opencode)
- **Bugs and feature requests** — [open an issue](https://github.com/mhrafin/opencode-permission-ui/issues)

## Contributing

Contributions are welcome! To get started:

1. Fork the repository and create a feature branch.
2. Make your change and keep it focused — one concern per pull request.
3. Run `npm run typecheck && npm run test` and make sure both pass.
4. Add or update tests for pure utilities.
5. Open a pull request describing what changed and why.

The project is maintained by **[@mhrafin](https://github.com/mhrafin)**.

## License

Released under the [MIT License](LICENSE).
