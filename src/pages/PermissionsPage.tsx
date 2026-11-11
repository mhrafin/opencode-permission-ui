import type { PermissionSavedInfo, Project } from "@opencode/client"
import { usePlugin } from "@opencode/plugin/tui"
import type { Route } from "@opencode/plugin/tui/context"
import { createMemo, createSignal, onMount, Show } from "solid-js"

export function createProjectTitle(canonical: string) {
  const separator = canonical.lastIndexOf("/")
  return separator === -1 ? canonical : canonical.slice(separator)
}

function getProjectFromDirectory(
  projects: Project[],
  directory: string,
): Project | undefined {
  return projects
    .filter((project) => directory === project.canonical)
    .sort((a, b) => a.canonical.length - b.canonical.length)[0]
}

type PermissionsPageProps = {
  returnRoute?: Route | undefined
}

export function PermissionsPage({ returnRoute }: PermissionsPageProps) {
  const context = usePlugin()

  // Signals
  const [projectID, setProjectID] = createSignal<string>()
  const [status, setStatus] = createSignal<string>()
  const [busy, setBusy] = createSignal(false)
  const [selected, setSelected] = createSignal(0)
  const [error, setError] = createSignal<string>()

  let request = 0

  // Memos
  const projects = createMemo(() => context.data.project.list())
  const project = createMemo(() =>
    projects().find((item) => item.id === projectID()),
  )
  const projectDir = createMemo(() => project()?.canonical)
  const permissions = createMemo(() => {
    const id = projectID()
    return id ? (context.data.project.permission.list(id) ?? []) : []
  })
  const options = createMemo(() =>
    permissions().map((permission: PermissionSavedInfo) => ({
      name: permission.action,
      description: permission.resource,
    })),
  )

  async function loadPermissions(id: string) {
    setStatus("loading")
    setError(undefined)
    try {
      await context.data.project.permission.sync(id)
      setStatus("ready")
    } catch (cause) {
      setStatus("error")
    }
  }

  async function pickProject() {
    if (projects().length === 0) return

    setBusy(true)

    try {
      const id = await context.ui.dialog.select({
        title: "Select project",
        current: projectID(),
        options: projects().map((item: Project) => ({
          title: createProjectTitle(item.canonical),
          value: item.id,
        })),
      })
      if (!id || id === projectID()) return
      setProjectID(id)
      setSelected(0)
      await loadPermissions(id)
    } finally {
      setBusy(false)
    }
  }
  async function initialize() {
    setStatus("loading")
    try {
      await context.data.project.sync()
      const currentDirectory = context.data.location.default().directory
      const currentProject = getProjectFromDirectory(
        projects(),
        currentDirectory,
      )
      const id = currentProject?.id ?? projects()[0]?.id

      if (!id) {
        setStatus("ready")
        return
      }
      setProjectID(id)
      setSelected(0)
      await loadPermissions(id)
    } catch (cause) {
      setStatus("error")
    }
  }

  onMount(() => {
    void initialize()
  })

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
        enabled: () => !busy(),
        run: async () =>
          context.ui.router.navigate(returnRoute ?? { type: "home" }),
      },
      {
        id: "permission-ui.project",
        title: "Change project",
        bind: "p",
        enabled: () => !busy(),
        run: () => void pickProject(),
      },
    ],
  }))

  return (
    <box
      borderStyle="rounded"
      flexGrow={1}
      padding={2}
      margin={4}
      gap={1}
      width={"auto"}
      title="Permission UI"
    >
      <text fg={context.theme.text.muted}>
        Rules saved when you choose "Allow always". They are scoped to the
        selected project.
      </text>
      {/* <text fg={context.theme.text.muted}>
        {context.data.location.default().directory}
      </text>
      <text fg={context.theme.text.muted}>
        {context.data.project.list().at(0)?.canonical}
      </text> */}
      <text>
        Selected project directory:{" " + projectDir()}
        {/* {
          getProjectFromDirectory(
            projects(),
            context.data.location.default().directory,
          )?.canonical
        } */}
      </text>
      <Show when={status() === "error"}>
        <text fg={context.theme.text.feedback.error.base}>{error()}</text>
      </Show>
      <Show when={project()}>
        <Show
          when={permissions().length > 0}
          fallback={
            <text fg={context.theme.text.muted}>
              No saved permissions for this project.
            </text>
          }
        >
          <box flexGrow={1} border borderColor={context.theme.border.base}>
            <select
              focused
              flexGrow={1}
              options={options()}
              // selectedIndex={selected()}
              // onChange={(index) => setSelected(index)}
            />
          </box>
        </Show>
      </Show>
      <text>[p] change project [esc] back</text>
    </box>
  )
}
