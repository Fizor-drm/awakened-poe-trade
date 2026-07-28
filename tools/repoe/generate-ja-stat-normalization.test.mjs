import test from 'node:test'
import assert from 'node:assert/strict'

import { buildNormalizations } from './stat-normalization.mjs'

const translation = (ids, language, variants) => ({
  ids,
  [language]: variants.map(({ string, format }) => ({
    string,
    format,
    condition: format.map(() => ({ min: null, max: null, negated: null })),
    index_handlers: format.map(() => [])
  }))
})

test('joins English and Japanese translations by stat ids and keeps canonical trade stats', () => {
  const english = [
    translation(['physical_damage_reduction_rating_+%'], 'English', [
      { string: '{0}% increased Armour', format: ['#'] }
    ]),
    translation(['base_physical_damage_reduction_rating'], 'English', [
      { string: '{0} to Armour', format: ['+#'] }
    ])
  ]
  const japanese = [
    translation(['base_physical_damage_reduction_rating'], 'Japanese', [
      { string: 'アーマー {0}', format: ['+#'] }
    ]),
    translation(['physical_damage_reduction_rating_+%'], 'Japanese', [
      { string: 'アーマーが{0}%増加する', format: ['#'] }
    ])
  ]
  const canonical = [
    {
      ref: '#% increased Armour',
      matchers: [{ string: '#% increased Armour' }],
      trade: { ids: { explicit: ['explicit.stat_2866361420'] } }
    },
    {
      ref: '+# to Armour',
      matchers: [{ string: '# to Armour' }],
      trade: { ids: { explicit: ['explicit.stat_809229260'] } }
    }
  ]

  assert.deepEqual(buildNormalizations(english, japanese, canonical), [
    {
      localized: 'アーマー #',
      canonical: '# to Armour',
      canonicalRef: '+# to Armour',
      statIds: ['base_physical_damage_reduction_rating'],
      valueOrder: [0]
    },
    {
      localized: 'アーマー #%',
      canonical: '#% increased Armour',
      canonicalRef: '#% increased Armour',
      statIds: ['physical_damage_reduction_rating_+%'],
      valueOrder: [0],
      source: 'client-alias'
    },
    {
      localized: 'アーマーが#%増加する',
      canonical: '#% increased Armour',
      canonicalRef: '#% increased Armour',
      statIds: ['physical_damage_reduction_rating_+%'],
      valueOrder: [0]
    }
  ])
})

test('derives Japanese client plus notation from RePoE increased wording', () => {
  const english = [
    translation(['cold_resistance'], 'English', [
      { string: '{0}% increased Cold Resistance', format: ['#'] }
    ])
  ]
  const japanese = [
    translation(['cold_resistance'], 'Japanese', [
      { string: '冷気耐性が{0}%増加する', format: ['#'] }
    ])
  ]
  const canonical = [{
    ref: '#% increased Cold Resistance',
    matchers: [{ string: '#% increased Cold Resistance' }],
    trade: { ids: { explicit: ['explicit.stat_4220027924'] } }
  }]

  assert.ok(buildNormalizations(english, japanese, canonical).some(entry =>
    entry.localized === '冷気耐性 #%' &&
    entry.canonical === '#% increased Cold Resistance' &&
    entry.source === 'client-alias'
  ))
})

test('records how Japanese placeholder order maps back to English order', () => {
  const english = [
    translation(['two_values'], 'English', [
      { string: '{0} to {1} Damage', format: ['+#', '#'] }
    ])
  ]
  const japanese = [
    translation(['two_values'], 'Japanese', [
      { string: '{1}ダメージに{0}', format: ['+#', '#'] }
    ])
  ]
  const canonical = [{
    ref: '+# to # Damage',
    matchers: [{ string: '# to # Damage' }],
    trade: { ids: { explicit: ['explicit.stat_1'] } }
  }]

  assert.deepEqual(buildNormalizations(english, japanese, canonical)[0], {
    localized: '#ダメージに#',
    canonical: '# to # Damage',
    canonicalRef: '+# to # Damage',
    statIds: ['two_values'],
    valueOrder: [1, 0]
  })
})

test('keeps RePoE sign conditions when Japanese client wording loses increased or reduced', () => {
  const english = [{
    ids: ['cold_resistance'],
    English: [
      {
        string: '{0}% increased Cold Resistance',
        format: ['#'],
        condition: [{ min: 1, max: null, negated: null }],
        index_handlers: [[]]
      },
      {
        string: '{0}% reduced Cold Resistance',
        format: ['#'],
        condition: [{ min: null, max: -1, negated: null }],
        index_handlers: [['negate']]
      }
    ]
  }]
  const japanese = [{
    ids: ['cold_resistance'],
    Japanese: [
      {
        string: '冷気耐性が{0}%増加する',
        format: ['#'],
        condition: [{ min: 1, max: null, negated: null }],
        index_handlers: [[]]
      },
      {
        string: '冷気耐性が{0}%減少する',
        format: ['#'],
        condition: [{ min: null, max: -1, negated: null }],
        index_handlers: [['negate']]
      }
    ]
  }]
  const canonical = [
    {
      ref: '#% increased Cold Resistance',
      matchers: [{ string: '#% increased Cold Resistance' }],
      trade: { ids: { explicit: ['explicit.stat_1'] } }
    },
    {
      ref: '#% reduced Cold Resistance',
      matchers: [{ string: '#% reduced Cold Resistance', negate: true }],
      trade: { ids: { explicit: ['explicit.stat_1'] } }
    }
  ]

  const shorthand = buildNormalizations(english, japanese, canonical)
    .filter(entry => entry.localized === '冷気耐性 #%')
  assert.deepEqual(shorthand.map(entry => entry.valueConditions), [
    [{ min: 1, max: null }],
    [{ min: null, max: -1 }]
  ])
  assert.ok(shorthand.every(entry => entry.source === 'client-alias'))
})

test('keeps distinct canonical candidates for an ambiguous Japanese matcher', () => {
  const english = [
    translation(['global_armour'], 'English', [
      { string: '{0}% increased Armour', format: ['#'] }
    ]),
    translation(['local_armour'], 'English', [
      { string: '{0}% increased Armour', format: ['#'] }
    ])
  ]
  const japanese = [
    translation(['local_armour'], 'Japanese', [
      { string: 'アーマーが{0}%増加する', format: ['#'] }
    ]),
    translation(['global_armour'], 'Japanese', [
      { string: 'アーマーが{0}%増加する', format: ['#'] }
    ])
  ]
  const canonical = [{
    resolve: { strat: 'select', test: ['ARMOUR', null] },
    stats: [
      {
        ref: '#% increased Armour (Local)',
        matchers: [{ string: '#% increased Armour' }],
        trade: { ids: { explicit: ['explicit.stat_local'] } }
      },
      {
        ref: '#% increased Armour',
        matchers: [{ string: '#% increased Armour' }],
        trade: { ids: { explicit: ['explicit.stat_global'] } }
      }
    ]
  }]

  const result = buildNormalizations(english, japanese, canonical)
  assert.deepEqual(result
    .filter(entry => entry.localized === 'アーマーが#%増加する')
    .map(entry => entry.canonicalRef), [
    '#% increased Armour',
    '#% increased Armour',
    '#% increased Armour (Local)',
    '#% increased Armour (Local)'
  ])
})
