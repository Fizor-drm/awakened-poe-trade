import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const normalize = (value) => value.replace(/\{\d+\}/g, '#').replace(/\s+/g, ' ').trim()

function render(entry) {
  return entry.string.replace(/\{(\d+)\}/g, (_, index) => entry.format?.[Number(index)] ?? '#')
}

const english = readJson(path.join(root, 'vendor', 'repoe-english', 'stat_translations.json'))
const japanese = readJson(path.join(root, 'vendor', 'repoe-japanese', 'stat_translations.json'))
const translations = new Map()

for (let index = 0; index < english.length; index += 1) {
  const en = english[index]
  const ja = japanese[index]
  if (JSON.stringify(en.ids) !== JSON.stringify(ja.ids)) {
    throw new Error(`RePoE translation entries differ at index ${index}`)
  }
  const englishTexts = en.English ?? []
  const japaneseTexts = ja.Japanese ?? []
  for (let translationIndex = 0; translationIndex < englishTexts.length; translationIndex += 1) {
    const enText = englishTexts[translationIndex]
    const jaText = japaneseTexts[translationIndex]
    if (jaText) {
      translations.set(normalize(render(enText)), render(jaText))
    }
  }
}

const input = path.join(root, 'renderer', 'public', 'data', 'en', 'stats.ndjson')
const output = path.join(root, 'renderer', 'public', 'data', 'ja', 'stats.ndjson')
let matched = 0
let unmatched = 0

const lines = fs.readFileSync(input, 'utf8').trimEnd().split(/\r?\n/).map((line) => {
  const stat = JSON.parse(line)
  for (const matcher of stat.matchers ?? []) {
    for (const field of ['string', 'advanced']) {
      if (typeof matcher[field] !== 'string') continue
      const translated = translations.get(normalize(matcher[field]))
      if (translated) {
        matcher[field] = translated
        matched += 1
      } else {
        unmatched += 1
      }
    }
  }
  return JSON.stringify(stat)
})

fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8')
console.log(`Generated ${output} with ${matched} translated matcher strings; ${unmatched} retained in English.`)
