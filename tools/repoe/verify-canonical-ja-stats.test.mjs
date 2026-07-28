import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { normalizeStatCandidates } from '../../renderer/src/parser/stat-normalization.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const dataFile = (language, file) => path.join(
  root, 'renderer', 'public', 'data', language, file
)
const readNdjson = file => fs.readFileSync(file, 'utf8')
  .trimEnd()
  .split(/\r?\n/)
  .map(line => JSON.parse(line))

const canonicalStats = readNdjson(dataFile('en', 'stats.ndjson'))
const normalizations = readNdjson(dataFile('ja', 'stat-normalization.ndjson'))

function placeholderInput (line) {
  const values = []
  const localized = line.replace(
    /(?<value>(?<!\d|\))[+-]?\d+(?:\.\d+)?)(?:\((?<min>.[^)-]*)(?:-(?<max>[^)]+))?\))?/g,
    (_, roll, min, max) => {
      values.push({
        roll: Number(roll),
        bounds: min == null
          ? undefined
          : { min: Number(min), max: Number(max ?? min) }
      })
      return '#'
    }
  )
  return { localized, values }
}

function statsOf (record) {
  return ('stats' in record) ? record.stats : [record]
}

function categoryMatches (category, expected) {
  if (expected === 'ARMOUR') return category === 'ARMOUR'
  return category === expected
}

function resolveCanonical (line, modType, category) {
  const input = placeholderInput(line)
  const candidates = normalizeStatCandidates(
    normalizations.filter(entry => entry.localized === input.localized),
    input.values
  )

  for (const candidate of candidates) {
    const record = canonicalStats.find(item =>
      statsOf(item).some(stat => stat.matchers.some(matcher =>
        matcher.string === candidate.matchStr ||
        matcher.advanced === candidate.matchStr
      ))
    )
    if (!record) continue

    let stat
    if (!('stats' in record)) {
      stat = record
    } else if (record.resolve.strat === 'select') {
      let index = record.resolve.test.findIndex(expected =>
        expected !== null && categoryMatches(category, expected))
      if (index === -1) index = record.resolve.test.indexOf(null)
      stat = record.stats[index]
    } else {
      stat = record.stats.find(item =>
        item.matchers.some(matcher => matcher.string === candidate.matchStr) &&
        modType in item.trade.ids
      )
    }
    if (
      stat?.ref === candidate.canonicalRef &&
      modType in stat.trade.ids
    ) {
      return { stat, candidate }
    }
  }
}

test('Japanese stats asset is canonical English data, not direct localized matching data', () => {
  assert.equal(
    fs.readFileSync(dataFile('ja', 'stats.ndjson'), 'utf8'),
    fs.readFileSync(dataFile('en', 'stats.ndjson'), 'utf8')
  )
})

test('normalizes reported Japanese armour and resistance examples to English trade ids', () => {
  const cases = [
    {
      line: 'アーマーが75(68-79)%増加する',
      type: 'explicit',
      category: 'ARMOUR',
      matcher: '#% increased Armour',
      tradeId: 'explicit.stat_1062208444'
    },
    {
      line: 'アーマー +98(83-101)',
      type: 'explicit',
      category: 'ARMOUR',
      matcher: '# to Armour',
      tradeId: 'explicit.stat_3484657501'
    },
    {
      line: '冷気耐性 +32(30-35)%',
      type: 'explicit',
      category: 'ARMOUR',
      matcher: '#% to Cold Resistance',
      tradeId: 'explicit.stat_4220027924'
    }
  ]

  for (const expected of cases) {
    const resolved = resolveCanonical(expected.line, expected.type, expected.category)
    assert.ok(resolved, `unresolved: ${expected.line}`)
    assert.equal(resolved.candidate.matchStr, expected.matcher)
    assert.equal(resolved.stat.trade.ids[expected.type][0], expected.tradeId)
  }
})

test('uses canonical English ids for explicit, implicit, crafted, and enchant mods', () => {
  const cases = [
    ['アーマーが75(68-79)%増加する', 'explicit', 'explicit.stat_1062208444'],
    ['アーマーが8(6-8)%増加する', 'implicit', 'implicit.stat_1062208444'],
    ['冷気耐性 +25(21-25)%', 'crafted', 'crafted.stat_4220027924'],
    ['クラフトモッドを追加で1個持つことができる', 'enchant', 'enchant.stat_1963398329']
  ]

  for (const [line, type, tradeId] of cases) {
    const resolved = resolveCanonical(line, type, 'ARMOUR')
    assert.ok(resolved, `unresolved ${type}: ${line}`)
    assert.equal(resolved.stat.trade.ids[type][0], tradeId)
  }
})
