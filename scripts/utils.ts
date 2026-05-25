import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import ISO6391 from 'iso-639-1'

export const parseWikiPages = (cacheDir: string) =>
  !existsSync(cacheDir)
    ? []
    : readdirSync(cacheDir)
        .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
        .map((file) => {
          const name = basename(file, '.md')
          const content = readFileSync(join(cacheDir, file), 'utf-8').trim()

          const lastDash = name.lastIndexOf('-')
          const suffix = lastDash > 0 ? name.slice(lastDash + 1) : ''
          const isLocale = suffix && suffix === suffix.toUpperCase() && ISO6391.validate(suffix.toLowerCase())
          const lang = isLocale ? suffix.toLowerCase() : 'root'

          const pageName = isLocale ? name.slice(0, lastDash) : name
          const slug = pageName === 'Home' ? 'index' : pageName.toLowerCase()
          const title = content.match(/^# (.+)/)?.[1]?.trimEnd() ?? pageName.replaceAll('-', ' ')

          return { name, lang, slug, title, content }
        })

export const buildLocales = (cacheDir: string, rootLang: string, repoLink: string) => {
  const wikiPages = parseWikiPages(cacheDir)
  const docsPages: Record<string, Array<{ slug: string; title: string }>> = {}

  for (const wikiPage of wikiPages)
    if (wikiPage.slug !== 'index')
      (docsPages[wikiPage.lang] ??= []).push({ slug: wikiPage.slug, title: wikiPage.title })

  const buildLocale = (lang: string) => {
    const langCode = lang === 'root' ? rootLang.split('-')[0] : lang
    return {
      label: ISO6391.getNativeName(langCode) || langCode.toUpperCase(),
      lang: langCode,
      themeConfig: {
        nav: [
          ...(docsPages[lang] ? [{ text: 'Docs', link: `/${docsPages[lang][0].slug}` }] : []),
          {
            text: 'Links',
            items: [
              { text: 'Releases', link: `${repoLink}/releases` },
              { text: 'Issues', link: `${repoLink}/issues` },
              { text: 'Wiki', link: `${repoLink}/wiki` }
            ]
          }
        ],
        sidebar: docsPages[lang]
          ? [
              {
                text: 'Docs',
                items: docsPages[lang].map((page) => ({ text: page.title, link: `/${page.slug}` }))
              }
            ]
          : [],
        editLink: {
          pattern: (() => {
            const wikiLink = JSON.stringify(`${repoLink}/wiki/`)
            const suffix = JSON.stringify(lang === 'root' ? '' : `-${lang.toUpperCase()}`)
            return new Function(
              '{ relativePath }',
              `return ${wikiLink} + relativePath.replace(/\\.md$/, '').split('/').pop() + ${suffix}`
            )
          })() as ({ relativePath }: { relativePath: string }) => string,
          text: 'Edit this page on Github Wiki'
        }
      }
    }
  }

  return {
    root: buildLocale('root'),
    ...Object.fromEntries(
      [...new Set(wikiPages.map((page) => page.lang).filter((lang) => lang !== 'root'))].map((lang) => [
        lang,
        buildLocale(lang)
      ])
    )
  }
}
