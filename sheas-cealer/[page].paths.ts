import { resolve } from 'node:path'
import { parseWikiPages } from '../scripts/utils'

export default {
  paths: () =>
    parseWikiPages(resolve(import.meta.dirname, '.vitepress', 'cache', 'wiki'))
      .filter((page) => page.lang === 'root' && page.slug !== 'index')
      .map((page) => ({
        params: { page: page.slug, title: page.title },
        content: page.content
      }))
}
