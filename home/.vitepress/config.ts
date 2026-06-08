import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'

export default withPwa(
  defineConfig({
    title: 'SpaceTime Docs',
    titleTemplate: ':title ❤ SpaceTime Docs',
    description: 'Welcome To My Docs Hub ~',
    head: [['link', { rel: 'icon', type: 'image/png', href: 'favicon.png' }]],
    lang: 'zh',
    base: '/',
    outDir: '../dist',
    cleanUrls: true,
    metaChunk: true,
    vite: { publicDir: '../public' },
    themeConfig: {
      logo: 'favicon.png',
      socialLinks: [
        {
          icon: {
            svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Email</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>'
          },
          link: 'mailto:Zeus6_6@163.com'
        },
        { icon: 'github', link: 'https://github.com/SpaceTimee/SpaceTime-Docs' }
      ],
      footer: {
        message: 'Developer ❤ Space Time',
        copyright: 'Ver. 1.0.3'
      },
      search: {
        provider: 'algolia',
        options: {
          appId: 'I28J8EY0B8',
          apiKey: '93ec978aaf48a04faaba1df8edb3ddf7',
          indexName: 'spacetime_docs',
          insights: true,
          askAi: {
            assistantId: 'e35a9e5c-06a9-40f6-a067-9613a7af1a2b',
            indexName: 'spaceTime_docs_markdown',
            agentStudio: true,
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
      outDir: '../dist',
      registerType: 'autoUpdate',
      manifest: {
        name: 'SpaceTime Docs',
        short_name: 'SpaceTime Docs',
        description: 'Welcome To My Docs Hub ~',
        theme_color: '#ff5a00',
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
      hostname: 'https://docs.spacetimee.xyz'
    }
  })
)
