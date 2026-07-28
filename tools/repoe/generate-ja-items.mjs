import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..', '..')
const englishRePoe = path.join(root, 'vendor', 'repoe-english', 'base_items.json')
const japaneseRePoe = path.join(root, 'vendor', 'repoe-japanese', 'base_items.json')
const englishItems = path.join(root, 'renderer', 'public', 'data', 'en', 'items.ndjson')
const japaneseItems = path.join(root, 'renderer', 'public', 'data', 'ja', 'items.ndjson')

function readJson (file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

const english = readJson(englishRePoe)
const japanese = readJson(japaneseRePoe)
const translatedNames = new Map()

for (const [id, englishItem] of Object.entries(english)) {
  const japaneseItem = japanese[id]
  if (japaneseItem?.name && englishItem.name && japaneseItem.name !== englishItem.name) {
    translatedNames.set(englishItem.name, japaneseItem.name)
  }
}

const output = fs.readFileSync(englishItems, 'utf8').trimEnd().split('\n').map(line => {
  const item = JSON.parse(line)
  const translated = translatedNames.get(item.name)
  return JSON.stringify(translated ? { ...item, name: translated } : item)
}).join('\n') + '\n'

fs.mkdirSync(path.dirname(japaneseItems), { recursive: true })
fs.writeFileSync(japaneseItems, output, 'utf8')
console.log(`Generated ${japaneseItems} with ${translatedNames.size} RePoE item-name mappings.`)
