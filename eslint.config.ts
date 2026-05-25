import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['node_modules', 'dist', '**/.vitepress/cache', '**/.vitepress/dist'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended
]
