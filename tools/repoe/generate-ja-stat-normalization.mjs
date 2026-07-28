import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildNormalizations } from './stat-normalization.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const readNdjson = file => fs.readFileSync(file, 'utf8')
  .trimEnd()
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => JSON.parse(line))

const englishTranslations = readJson(
  path.join(root, 'vendor', 'repoe-english', 'stat_translations.json')
)
const japaneseTranslations = readJson(
  path.join(root, 'vendor', 'repoe-japanese', 'stat_translations.json')
)
const canonicalStats = readNdjson(
  path.join(root, 'renderer', 'public', 'data', 'en', 'stats.ndjson')
)

const normalizations = buildNormalizations(
  englishTranslations,
  japaneseTranslations,
  canonicalStats
)
const output = path.join(
  root,
  'renderer',
  'public',
  'data',
  'ja',
  'stat-normalization.ndjson'
)

fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(
  output,
  `${normalizations.map(entry => JSON.stringify(entry)).join('\n')}\n`,
  'utf8'
)

const requiredMatchers = [
  'アーマーが#%増加する',
  'アーマー #',
  '冷気耐性 #%'
]
for (const localized of requiredMatchers) {
  if (!normalizations.some(entry => entry.localized === localized)) {
    throw new Error(`Missing required Japanese matcher: ${localized}`)
  }
}

console.log(
  `Generated ${path.relative(root, output)} with ${normalizations.length} English canonical mappings.`
)
