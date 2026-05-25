import { execSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseWikiPages } from './utils'

const rootDir = resolve(import.meta.dirname, '..')
const distDir = join(rootDir, 'dist')

rmSync(distDir, { recursive: true, force: true })
mkdirSync(distDir, { recursive: true })

const projectNames = readdirSync(rootDir).filter((name) => existsSync(join(rootDir, name, '.vitepress')))

writeFileSync(
  join(rootDir, 'api', 'projects.json'),
  JSON.stringify(projectNames.map((name) => name.toLowerCase()))
)

for (const projectName of projectNames) {
  const projectDir = join(rootDir, projectName)
  const cacheDir = join(projectDir, '.vitepress', 'cache', 'wiki')
  const configPath = join(projectDir, '.vitepress', 'config.ts')
  const { repoLink } = await import(pathToFileURL(configPath).href)

  if (repoLink) {
    try {
      rmSync(cacheDir, { recursive: true, force: true })
      execSync(`git clone --depth 1 ${repoLink}.wiki.git "${cacheDir}"`, { stdio: 'inherit' })

      const localeNames = new Set(
        parseWikiPages(cacheDir)
          .map((page) => page.lang)
          .filter((lang) => lang !== 'root')
      )

      for (const localeName of localeNames) {
        const localeDir = join(projectDir, localeName)

        mkdirSync(localeDir, { recursive: true })

        for (const routeName of ['[home]', '[page]']) {
          const markdownPath = join(projectDir, `${routeName}.md`)

          if (existsSync(markdownPath)) copyFileSync(markdownPath, join(localeDir, `${routeName}.md`))

          const loaderPath = join(projectDir, `${routeName}.paths.ts`)

          if (existsSync(loaderPath))
            writeFileSync(
              join(localeDir, `${routeName}.paths.ts`),
              readFileSync(loaderPath, 'utf-8')
                .replace(`'../scripts/utils'`, `'../../scripts/utils'`)
                .replace(`import.meta.dirname, '.vitepress'`, `import.meta.dirname, '..', '.vitepress'`)
                .replace(`'root'`, `'${localeName}'`)
            )
        }
      }
    } catch {
      /* skip */
    }
  }

  execSync(`vitepress build ${projectName}`, { cwd: rootDir, stdio: 'inherit' })
  rmSync(join(projectDir, '.vitepress', 'cache'), { recursive: true, force: true })

  console.log(`\n${projectName} built\n`)
}
