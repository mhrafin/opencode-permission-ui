import { transformAsync } from "@babel/core"
import typescript from "@babel/preset-typescript"
import solid from "babel-preset-solid"
import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceDirectory = path.join(root, "src")
const outputDirectory = path.join(root, "dist")
const sourceFile = /\.[cm]?tsx?$/
const jsxFile = /\.[cm]?tsx$/
const relativeImport = /(?:from\s+|import\s*\()(["'])(\.[^"']*)\1/g

await rm(outputDirectory, { recursive: true, force: true })

const files = (await readdir(sourceDirectory, { recursive: true }))
  .filter((file) => sourceFile.test(file))
  .sort()

for (const file of files) {
  const filename = path.join(sourceDirectory, file)
  const code = await readFile(filename, "utf8")
  const presets = []

  if (jsxFile.test(file)) {
    presets.push([
      solid,
      { moduleName: "@opentui/solid", generate: "universal" },
    ])
  }
  presets.push([typescript])

  const transformed = await transformAsync(code, {
    filename,
    configFile: false,
    babelrc: false,
    sourceType: "module",
    presets,
  })

  const target = path.join(outputDirectory, file.replace(sourceFile, ".js"))
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, `${transformed?.code ?? ""}\n`)
}

const outputFiles = (await readdir(outputDirectory, { recursive: true }))
  .filter((file) => file.endsWith(".js"))
  .map((file) => path.join(outputDirectory, file))

for (const file of outputFiles) {
  const code = await readFile(file, "utf8")

  for (const runtime of [
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    "jsxDEV",
  ]) {
    if (code.includes(runtime)) {
      throw new Error(
        `${path.relative(root, file)} still references ${runtime}; the Solid JSX transform did not run`,
      )
    }
  }

  for (const match of code.matchAll(relativeImport)) {
    const imported = path.resolve(path.dirname(file), match[2])
    if (!existsSync(imported)) {
      throw new Error(
        `${path.relative(root, file)} imports missing module ${match[2]}`,
      )
    }
  }
}

console.log(
  `Built ${outputFiles.length} modules into ${path.relative(root, outputDirectory)}`,
)
