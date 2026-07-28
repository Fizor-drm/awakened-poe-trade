import test from 'node:test'
import assert from 'node:assert/strict'

import {
  normalizeStatCandidates,
  localizedStatDisplay
} from '../../renderer/src/parser/stat-normalization.ts'

test('prefers a direct RePoE matcher over a generated client alias', () => {
  const values = [{ roll: 32 }, { roll: 10 }]
  const candidates = [
    {
      localized: '冷気耐性 #%',
      canonical: '#% increased Cold Resistance',
      canonicalRef: '#% increased Cold Resistance',
      statIds: ['cold_damage_resistance_+%'],
      valueOrder: [0],
      source: 'client-alias'
    },
    {
      localized: '冷気耐性 #%',
      canonical: '#% to Cold Resistance',
      canonicalRef: '+#% to Cold Resistance',
      statIds: ['base_cold_damage_resistance_%'],
      valueOrder: [0]
    }
  ]

  const result = normalizeStatCandidates(candidates, values)
  assert.equal(result[0].matchStr, '#% to Cold Resistance')
  assert.equal(result[0].values[0], values[0])
})

test('filters candidates using RePoE value conditions', () => {
  const candidates = [
    {
      localized: '冷気耐性 #%', canonical: '#% increased Cold Resistance',
      canonicalRef: '#% increased Cold Resistance', statIds: ['res'], valueOrder: [0],
      valueConditions: [{ min: 1, max: null }]
    },
    {
      localized: '冷気耐性 #%', canonical: '#% reduced Cold Resistance',
      canonicalRef: '#% increased Cold Resistance', statIds: ['res'], valueOrder: [0],
      valueConditions: [{ min: null, max: -1 }]
    }
  ]

  assert.deepEqual(
    normalizeStatCandidates(candidates, [{ roll: -12 }]).map(entry => entry.matchStr),
    ['#% reduced Cold Resistance']
  )
})

test('reorders Japanese values into canonical English placeholder order', () => {
  const first = { roll: 7 }
  const second = { roll: 12 }
  const result = normalizeStatCandidates([{
    localized: '#ダメージに#',
    canonical: '# to # Damage',
    canonicalRef: '+# to # Damage',
    statIds: ['two_values'],
    valueOrder: [1, 0]
  }], [first, second])

  assert.deepEqual(result[0].values, [second, first])
})

test('uses one consistent localized source matcher for UI display', () => {
  assert.equal(
    localizedStatDisplay('#% to Cold Resistance', ['冷気耐性 #%']),
    '冷気耐性 #%'
  )
  assert.equal(
    localizedStatDisplay('#% increased Armour', ['アーマー #%','アーマーが#%増加する']),
    '#% increased Armour'
  )
})
