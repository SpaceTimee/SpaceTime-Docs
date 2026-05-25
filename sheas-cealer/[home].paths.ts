import { resolve } from 'node:path'
import { parseWikiPages } from '../scripts/utils'

export default {
  paths: () => [
    {
      params: { home: 'index' },
      content:
        parseWikiPages(resolve(import.meta.dirname, '.vitepress', 'cache', 'wiki')).find(
          (page) => page.lang === 'root' && page.slug === 'index'
        )?.content ?? ''
    }
  ]
}
