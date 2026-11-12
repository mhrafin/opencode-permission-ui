import { existsSync } from "node:fs"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const dist = fileURLToPath(new URL("../dist/", import.meta.url))
const files = readdirSync(dist, { recursive: true, encoding: "utf8" }).filter(
  (file) => file.endsWith(".js"),
)
const relativeImport = /(?:from\s+|import\s*\()(["'])(\.[^"']*)\1/g

describe("build output", () => {
  it("compiles every module without a React JSX runtime", () => {
    for (const file of files) {
      const code = readFileSync(path.join(dist, file), "utf8")
      expect(code, file).not.toMatch(/react\/jsx|jsxDEV/)
    }
  })

  it("resolves every relative import", () => {
    for (const file of files) {
      const code = readFileSync(path.join(dist, file), "utf8")
      for (const match of code.matchAll(relativeImport)) {
        const imported = path.resolve(
          path.dirname(path.join(dist, file)),
          match[2],
        )
        expect(existsSync(imported), `${file} -> ${match[2]}`).toBe(true)
      }
    }
  })
})
