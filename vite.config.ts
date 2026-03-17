import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function readEnvLocalValue(key: string): string {
  const envLocalPath = path.resolve(__dirname, '.env.local')

  if (!fs.existsSync(envLocalPath)) {
    return ''
  }

  const envLocalContent = fs.readFileSync(envLocalPath, 'utf-8')
  const lines = envLocalContent.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex <= 0) {
      continue
    }

    const parsedKey = trimmed.slice(0, separatorIndex).trim()
    let parsedValue = trimmed.slice(separatorIndex + 1).trim()

    const hasWrappingSingleQuotes =
      parsedValue.startsWith("'") && parsedValue.endsWith("'") && parsedValue.length >= 2
    const hasWrappingDoubleQuotes =
      parsedValue.startsWith('"') && parsedValue.endsWith('"') && parsedValue.length >= 2

    if (hasWrappingSingleQuotes || hasWrappingDoubleQuotes) {
      parsedValue = parsedValue.slice(1, -1)
    }

    if (parsedKey === key) {
      return parsedValue
    }
  }

  return ''
}

function readConfigValue(key: string): string {
  const fromProcessEnv = process.env[key]?.trim()

  if (fromProcessEnv) {
    return fromProcessEnv
  }

  return readEnvLocalValue(key)
}

const convaiApiKey = readConfigValue('VITE_CONVAI_API_KEY')
const convaiCharacterId = readConfigValue('VITE_CONVAI_CHARACTER_ID')

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __CONVAI_API_KEY__: JSON.stringify(convaiApiKey),
    __CONVAI_CHARACTER_ID__: JSON.stringify(convaiCharacterId),
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
