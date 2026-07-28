import {
  CLIENT_STRINGS as _$,
  STAT_BY_MATCH_STR_V2,
  STAT_NORMALIZATIONS_BY_MATCH_STR
} from '@/assets/data'
import type { StatMatcher, Stat, StatGroup } from '@/assets/data'
import type { ModifierType } from './modifiers'
import { type ItemCategory, ARMOUR, WEAPON, HEIST_EQUIPMENT } from './meta'
import { normalizeStatCandidates } from './stat-normalization'

// This file is a little messy and scary,
// but that's how stats translations are parsed :-D

const LOCALIZED_PAREN_LEFT = /^\s*(?:\(|（)/
const LOCALIZED_PAREN_RIGHT = /(?:\)|）)\s*$/

export interface ParsedStat {
  readonly stat: Stat
  readonly translation: StatMatcher
  roll?: {
    unscalable: boolean
    legacy?: true
    dp: boolean
    value: number
    min: number
    max: number
  }
}

interface StatString {
  string: string
  unscalable: boolean
}

export function * linesToStatStrings (lines: string[]): Generator<StatString, string[], boolean> {
  const notParsedLines: string[] = []

  let reminderString = false

  outer:
  for (let start = 0; start < lines.length; start += 1) {
    if (lines[start].match(LOCALIZED_PAREN_LEFT)) {
      reminderString = true
    }
    if (reminderString && lines[start].match(LOCALIZED_PAREN_RIGHT)) {
      reminderString = false
      continue
    }
    if (reminderString) {
      continue
    }

    for (let end = start; end < lines.length; end += 1) {
      let str = lines.slice(start, end + 1).join('\n')

      const unscalable = str.endsWith(_$.UNSCALABLE_VALUE)
      if (unscalable) {
        str = str.slice(0, -_$.UNSCALABLE_VALUE.length)
      }

      const isParsed: boolean = yield { string: str, unscalable }
      if (isParsed) {
        start += (end - start)
        continue outer
      }
    }
    notParsedLines.push(lines[start])
  }
  return notParsedLines.filter(line => line.length)
}

const PLACEHOLDER_MAP = [
  // 0 # -> max 0 #
  [[]],
  // 1 # -> max 1 #
  [[0], []],
  // 2 # -> max 2 #
  [[0, 1], [0], [1], []],
  // 3 # -> max 2 #
  [[0, 1, 2], [1, 2], [0, 2], [0, 1], [2], [1], [0]],
  // 4 # -> max 2 #
  [[0, 1, 2, 3], [1, 2, 3], [0, 2, 3], [0, 1, 3], [0, 1, 2], [2, 3], [1, 3], [1, 2], [0, 3], [0, 2], [0, 1]]
]

function * _statPlaceholderGenerator (stat: string) {
  const matches: Array<{
    roll: number
    rollStr: string
    decimal: boolean
    bounds?: { min: number, max: number }
  }> = []
  const withPlaceholders = stat
    .replace(/\(\)/gm, '') // when GGG didn't provide advanced desc, like in "Passives in Radius of Wicked Ward() can be Allocated"
    .replace(/(?<value>(?<!\d|\))[+-]?\d+(?:\.\d+)?)(?:\((?<min>.[^)-]*)(?:-(?<max>[^)]+))?\))?/gm, (_, roll: string, min?: string, max?: string) => {
      if (min != null && max == null) {
        // example: Sextant "# uses remaining", legacy rolls
        max = min
      }

      const captured: typeof matches[number] = {
        roll: Number(roll),
        rollStr: roll,
        decimal: roll.includes('.') || min?.includes('.') || max?.includes('.') || false,
        bounds: { min: Number(min), max: Number(max) }
      }
      matches.push(captured)

      if (Number.isNaN(captured.bounds!.min) || Number.isNaN(captured.bounds!.max)) {
        captured.bounds = undefined
        return (min != null) ? `#(${min}-${max})` : '#'
      } else {
        return '#'
      }
    })

  if (matches.length < PLACEHOLDER_MAP.length) {
    for (const replacements of PLACEHOLDER_MAP[matches.length]) {
      let idx = -1
      const replaced = withPlaceholders.replace(/#/gm, () => {
        idx += 1
        return replacements.includes(idx)
          ? matches[idx].rollStr
          : '#'
      })

      yield {
        stat: replaced,
        values: matches
          .filter((_, idx) => !replacements.includes(idx)) as
            Array<Pick<typeof matches[number], 'roll' | 'bounds' | 'decimal'>>
      }
    }
  }

  // fallback to exact stat text, without any placeholders
  // N # -> max 0 #
  yield { stat, values: [] }
}

export function tryParseTranslation (
  stat: StatString,
  modType: ModifierType,
  itemCategory: ItemCategory | undefined
): ParsedStat | undefined {
  for (const combination of _statPlaceholderGenerator(stat.string)) {
    const normalizations = STAT_NORMALIZATIONS_BY_MATCH_STR(combination.stat)
    const candidates = normalizations.length
      ? normalizeStatCandidates(normalizations, combination.values)
      : [{
          matchStr: combination.stat,
          values: combination.values,
          displayMatcher: combination.stat,
          canonicalRef: undefined
        }]

    for (const candidate of candidates) {
      const values = candidate.values.map(value => ({
        ...value,
        bounds: value.bounds && { ...value.bounds }
      }))
      const found = findAndResolveTranslation({
        matchStr: candidate.matchStr,
        modType: modType,
        itemCategory: itemCategory,
        roll: (values.length === 1) ? values[0].roll : undefined
      })
      if (
        !found ||
        !(modType in found.stat.trade.ids) ||
        (candidate.canonicalRef != null && found.stat.ref !== candidate.canonicalRef)
      ) {
        continue
      }

      // Modifiers must be upgraded to the new values with a Divine Orb
      let legacyStatRolls = false

      if (found.matcher.negate) {
        for (const stat of values) {
          stat.roll *= -1
          if (stat.bounds) {
            stat.bounds.min *= -1
            stat.bounds.max *= -1
          }
        }
      }

      if (found.stat.ref === '# uses remaining') {
        const uses = values[0]
        uses.bounds = {
          min: 1,
          max: uses.bounds?.max ?? uses.roll
        }
      }

      for (const stat of values) {
        if (!stat.bounds) continue

        if (stat.bounds.min > stat.bounds.max) {
          // some stats granted by legacy Modifiers (not legacy rolls)
          // can have same stat translations as granted by new Modifiers
          // but swapped translation strings for positive and negative rolls
          stat.bounds = {
            max: stat.bounds.min,
            min: stat.bounds.max
          }
          // don't consider them as a legacy rolls
        }

        if (stat.roll > stat.bounds.max) {
          stat.bounds.max = stat.roll
          legacyStatRolls = true
        }
        if (stat.roll < stat.bounds.min) {
          stat.bounds.min = stat.roll
          legacyStatRolls = true
        }
      }

      if (!values.length && found.matcher.value) {
        values.push({
          roll: found.matcher.value,
          decimal: false,
          bounds: {
            min: found.matcher.value,
            max: found.matcher.value
          }
        })
      }

      const displayTranslation: StatMatcher =
        (candidate.displayMatcher === found.matcher.string)
          ? found.matcher
          : {
              ...found.matcher,
              string: candidate.displayMatcher,
              advanced: undefined
            }

      return {
        stat: found.stat,
        translation: displayTranslation,
        roll: values.length
          ? {
              unscalable: stat.unscalable,
              legacy: legacyStatRolls || undefined,
              dp: found.stat.dp || values.some(stat => stat.decimal),
              value: getRollOrMinmaxAvg(values.map(stat => stat.roll)),
              min: getRollOrMinmaxAvg(values.map(stat => stat.bounds?.min ?? stat.roll)),
              max: getRollOrMinmaxAvg(values.map(stat => stat.bounds?.max ?? stat.roll))
            }
          : undefined
      }
    }
  }
}

export function getRollOrMinmaxAvg (values: number[]): number {
  if (values.length === 2) {
    return (values[0] + values[1]) / 2
  } else {
    return values[0]
  }
}

interface FindResolveParams {
  matchStr: string
  modType: ModifierType
  itemCategory: ItemCategory | undefined
  roll: number | undefined
}

function findAndResolveTranslation (
  params: FindResolveParams
): { matcher: StatMatcher, stat: Stat } | undefined {
  const { matchStr } = params
  const statOrGroup = STAT_BY_MATCH_STR_V2(matchStr)
  if (!statOrGroup) return undefined

  let stat: Stat | undefined
  if (!('stats' in statOrGroup)) {
    stat = statOrGroup
  } else {
    stat = _resolveTranslation(statOrGroup, params)
  }

  if (stat) {
    const matcher = stat.matchers.find(m =>
      m.string === matchStr || m.advanced === matchStr)
    if (!matcher) return undefined
    return { stat, matcher }
  }
  return undefined
}

export function _resolveTranslation (
  statGroup: StatGroup,
  params: FindResolveParams
): Stat | undefined {
  const { resolve, stats } = statGroup
  const { matchStr, modType, itemCategory, roll } = params
  if (resolve.strat === 'select') {
    // give priority to exact match
    let idx = resolve.test.findIndex(expected => expected !== null &&
      testItemCategory(itemCategory ?? null, expected))
    // fallback to any match (if it exists at all)
    if (idx === -1) idx = resolve.test.indexOf(null)
    return (idx !== -1) ? stats[idx] : undefined
  }

  const onTradeStats = stats.filter(stat => (modType in stat.trade.ids))
  if (onTradeStats.length === 1) return onTradeStats[0]

  if (resolve.strat === 'trivial-merge') {
    const withMatchStr = (matchStr.length)
      ? onTradeStats.filter(stat =>
          stat.matchers.some(m => m.string === matchStr || m.advanced === matchStr))
      : onTradeStats
    if (!withMatchStr.length) return undefined
    const merged = withMatchStr[0]
    for (const stat of withMatchStr) {
      if (merged === stat) continue
      _mergeTradeIdsInto(merged, stat)
    }
    return merged
  } else if (resolve.strat === 'percent-merge') {
    const pctStat = stats[resolve.kind.indexOf('percent')]
    const matcher = pctStat.matchers.find(m =>
      m.string === matchStr || m.advanced === matchStr)
    const roll100 = (matcher !== undefined && matcher.value === 100)
    if (roll100) {
      const otherStat = stats[resolve.kind.indexOf('value')]
      const flag = (otherStat.matchers.length === 1 && !otherStat.matchers[0].string.includes('#'))
      _mergeTradeIdsInto(pctStat, otherStat, flag ? '{empty_if_100}' : '{div_by_100}')
      return pctStat
    }
    return stats.find(stat =>
      stat.matchers.some(m => m.string === matchStr || m.advanced === matchStr))
  } else if (resolve.strat === 'flag-merge') {
    if (roll === undefined) return undefined
    const valStat = stats[resolve.kind.indexOf('value')]
    const flagStat = stats[resolve.kind.indexOf('flag')]
    const flagRoll = flagStat.matchers[0].value!
    if (roll === flagRoll) {
      _mergeTradeIdsInto(valStat, flagStat, '{empty}')
    }
    return valStat
  }
  return undefined
}

function _mergeTradeIdsInto (dest: Stat, source: Stat, prefix?: string) {
  for (const modType in source.trade.ids) {
    let tradeId = source.trade.ids[modType][0]
    if (prefix) tradeId = prefix + tradeId
    if (modType in dest.trade.ids) {
      if (!dest.trade.ids[modType].includes(tradeId)) {
        dest.trade.ids[modType].push(tradeId)
      }
    } else {
      dest.trade.ids[modType] = [tradeId]
    }
  }
}

function testItemCategory (actual: ItemCategory | null, expected: string): boolean {
  if (actual === null) return false

  switch (expected) {
    case 'WEAPON':
      return WEAPON.has(actual)
    case 'ARMOUR':
      return ARMOUR.has(actual)
    case 'HEIST_EQUIPMENT':
      return HEIST_EQUIPMENT.has(actual)
    default:
      return expected === actual
  }
}
