import { resolve } from 'node:path'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'
import { buildLocales } from '../../scripts/utils'

const rootLang = 'zh'
export const repoLink = 'https://github.com/SpaceTimee/Sheas-Cealer'

export default withPwa(
  defineConfig({
    title: 'Sheas Cealer Docs',
    titleTemplate: ':title ❤ Sheas Cealer Docs',
    description: 'Welcome To Sheas Cealer Docs ~',
    head: [['link', { rel: 'icon', type: 'image/png', href: 'favicon.png' }]],
    lang: rootLang,
    base: '/sheas-cealer/',
    outDir: '../dist/sheas-cealer',
    cleanUrls: true,
    metaChunk: true,
    locales: buildLocales(resolve(import.meta.dirname, 'cache', 'wiki'), rootLang, repoLink),
    themeConfig: {
      logo: 'favicon.png',
      socialLinks: [
        {
          icon: {
            svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>QQ</title><path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"/></svg>'
          },
          link: 'https://qun.qq.com/universal-share/share?busi_data=eyJncm91cENvZGUiOiI5NjQxMDIwODAiLCJ0b2tlbiI6Ik9NM25aTk1qV0tKZUZFSEtOUFJCelk2WEZXRWdrYkkxNEM3Yk04cDQ5dHQrQ1RDYnJsS3hsZjV4MXkxa1YyS20iLCJ1aW4iOiIzNTc0OTM0OTY5In0=&data=GRm-rHKuaNfuVpkglSItwVK7mMsNEKwb2gT4vdPpk3oDDCkhsIMOSTngXV6edxJxzcfHM90gdT7aWMBn3kFWbA&svctype=4&tempid=h5_group_info'
        },
        {
          icon: {
            svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
          },
          link: 'https://t.me/PixCealerChat'
        },
        {
          icon: {
            svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Email</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>'
          },
          link: 'mailto:Zeus6_6@163.com'
        },
        { icon: 'github', link: repoLink }
      ],
      footer: {
        message: 'Developer ❤ Space Time',
        copyright: 'Ver. 1.0.2'
      },
      search: {
        provider: 'algolia',
        options: {
          appId: 'I28J8EY0B8',
          apiKey: '93ec978aaf48a04faaba1df8edb3ddf7',
          indexName: 'spacetime_docs',
          insights: true,
          searchParameters: {
            facetFilters: ['project:sheas-cealer']
          },
          askAi: {
            assistantId: 'e35a9e5c-06a9-40f6-a067-9613a7af1a2b',
            indexName: 'spacetime_docs_markdown',
            agentStudio: true,
            searchParameters: {
              spacetime_docs_markdown: {
                filters: 'project:sheas-cealer'
              }
            },
            sidePanel: {
              panel: {
                suggestedQuestions: true
              }
            }
          }
        }
      }
    },
    pwa: {
      outDir: '../dist/sheas-cealer',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sheas Cealer Docs',
        short_name: 'Sheas Cealer Docs',
        description: 'Welcome To Sheas Cealer Docs ~',
        theme_color: '#f44336',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      experimental: {
        includeAllowlist: true
      }
    },
    sitemap: {
      hostname: 'https://docs.spacetimee.xyz/sheas-cealer'
    }
  })
)
