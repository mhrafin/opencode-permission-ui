import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

type Manifest = {
  exports: Record<string, string>
  files: string[]
  peerDependencies: Record<string, string>
  scripts: Record<string, string>
}

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as Manifest

describe("package manifest", () => {
  it("exports the compiled TUI entrypoint", () => {
    expect(manifest.exports["./tui"]).toBe("./dist/tui.js")
  })

  it("publishes the build output instead of raw TSX", () => {
    expect(manifest.files).toContain("dist")
    expect(manifest.files).not.toContain("src")
  })

  it("builds before packing and keeps the OpenTUI peers", () => {
    expect(manifest.scripts.build).toBe("node scripts/build.mjs")
    expect(manifest.scripts.prepare).toBe("npm run build")
    expect(manifest.peerDependencies).toMatchObject({
      "@opentui/core": expect.any(String),
      "@opentui/solid": expect.any(String),
      "solid-js": expect.any(String),
    })
  })
})
