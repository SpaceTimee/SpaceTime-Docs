import type { Plugin, ResolvedConfig } from 'vite'
import { XMLParser } from 'fast-xml-parser'
import { Feed } from 'feed'
import MarkdownIt from 'markdown-it'
import { parseWikiPages } from '../scripts/utils'

interface AtomFeedOptions {
  readonly siteUrl: string
  readonly title: string
  readonly description: string
  readonly base: string
  readonly cacheDir: string
  readonly author: string
}

interface ExistingEntry {
  readonly content: string
  readonly link: string
  readonly updated: string
}

interface DataEntry {
  readonly title: string
  readonly content: string
  readonly link: string
}

export function AtomFeed(options: AtomFeedOptions): Plugin {
  let config: ResolvedConfig

  return {
    name: 'atom-feed',
    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async generateBundle() {
      if (config.build.ssr) return

      const { title, description, author, base, siteUrl, cacheDir } = options
      const now = new Date()

      const extractText = (value: unknown) =>
        typeof value === 'string'
          ? value
          : value && typeof value === 'object' && '#text' in value
            ? String((value as Record<string, unknown>)['#text'])
            : String(value ?? '')

      const markdown = new MarkdownIt()
      const pagesByLang = Map.groupBy(
        parseWikiPages(cacheDir).filter((page) => page.slug !== 'index'),
        (page) => page.lang
      )

      for (const [lang, langPages] of pagesByLang) {
        const langBase = lang === 'root' ? base : `${base}${lang}/`
        const feedPath = lang === 'root' ? 'atom.xml' : `${lang}/atom.xml`

        const currentEntries: DataEntry[] = langPages.map((page) => ({
          title: page.title,
          content: markdown.render(page.content),
          link: `${siteUrl}${langBase}${page.slug}`
        }))

        const existingEntries = new Map<string, ExistingEntry>()
        try {
          const response = await fetch(`${siteUrl}${langBase}atom.xml`)
          if (response.ok) {
            const xml = await response.text()
            const parser = new XMLParser({
              ignoreAttributes: false,
              attributeNamePrefix: '@_',
              isArray: (_, jpath) => jpath === 'feed.entry' || jpath === 'feed.entry.link'
            })

            for (const entry of parser.parse(xml)?.feed?.entry ?? []) {
              const entryTitle = extractText(entry.title)
              const content = extractText(entry.content)
              const links: unknown[] = entry.link ?? []
              const link =
                (links as Record<string, string>[]).find(
                  (linkEl) => !linkEl['@_rel'] || linkEl['@_rel'] === 'alternate'
                )?.['@_href'] || ''
              const updated = typeof entry.updated === 'string' ? entry.updated : String(entry.updated ?? '')

              if (entryTitle) {
                existingEntries.set(entryTitle, { content, link, updated })
              }
            }
          }
        } catch {
          // Ignore fetch failures
        }

        const currentTitles = new Set(currentEntries.map((entry) => entry.title))
        const hasDeletedEntries = [...existingEntries.keys()].some(
          (existingTitle) => !currentTitles.has(existingTitle)
        )

        let feedUpdated = new Date(0)

        const feedItems = currentEntries.map((entry) => {
          const existing = existingEntries.get(entry.title)
          let updatedDate: Date

          if (!existing || entry.content !== existing.content || entry.link !== existing.link) {
            updatedDate = now
          } else {
            updatedDate = new Date(existing.updated)
            if (Number.isNaN(updatedDate.getTime())) updatedDate = now
          }

          if (updatedDate > feedUpdated) feedUpdated = updatedDate

          return {
            title: entry.title,
            id: entry.link,
            content: entry.content,
            link: entry.link,
            date: updatedDate
          }
        })

        if (hasDeletedEntries && now > feedUpdated) {
          feedUpdated = now
        }

        const feed = new Feed({
          title,
          description,
          id: `${siteUrl}${langBase}`,
          link: `${siteUrl}${langBase}`,
          feedLinks: {
            atom: `${siteUrl}${langBase}atom.xml`
          },
          author: {
            name: author
          },
          updated: feedUpdated
        })

        for (const item of feedItems) {
          feed.addItem(item)
        }

        this.emitFile({
          type: 'asset',
          fileName: feedPath,
          source: feed.atom1()
        })
      }
    }
  }
}
