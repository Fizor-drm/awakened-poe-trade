const TOKEN = /\uE000(\d+)\uE001/g

function idsKey (record) {
  return JSON.stringify([...(record.ids ?? [])].sort())
}

function formatPlaceholder (format, token) {
  if (format === 'ignore') return ''
  return (format ?? '#').replace('#', token).replace(/^\+/, '')
}

function renderVariant (variant, preserveIds = false) {
  return variant.string
    .replace(/\{(\d+)\}/g, (_, rawIndex) => {
      const index = Number(rawIndex)
      const token = preserveIds ? `\uE000${index}\uE001` : '#'
      return formatPlaceholder(variant.format?.[index], token)
    })
    .replace(/\s+/g, ' ')
    .trim()
}

function matcherWithOrder (variant) {
  const rendered = renderVariant(variant, true)
  const variableIds = []
  const matcher = rendered.replace(TOKEN, (_, rawId) => {
    variableIds.push(Number(rawId))
    return '#'
  })
  return { matcher, variableIds }
}

function allCanonicalStats (records) {
  return records.flatMap(record => ('stats' in record) ? record.stats : [record])
}

function tradeIdsOf (stat) {
  return new Set(Object.values(stat.trade?.ids ?? {}).flat())
}

function canonicalCandidates (record, canonicalByMatcher, canonicalMatcher) {
  const candidates = canonicalByMatcher.get(canonicalMatcher) ?? []
  const recordTradeIds = new Set((record.trade_stats ?? []).map(stat => stat.id))
  if (!recordTradeIds.size) return candidates

  const withMatchingTradeId = candidates.filter(({ stat }) =>
    [...tradeIdsOf(stat)].some(id => recordTradeIds.has(id)))
  return withMatchingTradeId.length ? withMatchingTradeId : candidates
}

function localizedClientMatchers (matcher) {
  const matchers = [{ matcher, source: undefined }]
  const increased = matcher.match(/^(.+?)が#(%)?増加する$/)
  if (increased) {
    matchers.push({
      matcher: `${increased[1]} #${increased[2] ?? ''}`,
      source: 'client-alias'
    })
  }
  const reduced = matcher.match(/^(.+?)が#(%)?減少する$/)
  if (reduced) {
    matchers.push({
      matcher: `${reduced[1]} #${reduced[2] ?? ''}`,
      source: 'client-alias'
    })
  }
  return matchers
}

export function buildNormalizations (
  englishTranslations,
  japaneseTranslations,
  canonicalRecords
) {
  const japaneseByIds = new Map(japaneseTranslations.map(record => [idsKey(record), record]))
  const canonicalByMatcher = new Map()

  for (const stat of allCanonicalStats(canonicalRecords)) {
    for (const matcher of stat.matchers ?? []) {
      for (const text of [matcher.string, matcher.advanced]) {
        if (!text) continue
        const entries = canonicalByMatcher.get(text) ?? []
        entries.push({ stat, matcher: text })
        canonicalByMatcher.set(text, entries)
      }
    }
  }

  const output = []
  for (const englishRecord of englishTranslations) {
    const japaneseRecord = japaneseByIds.get(idsKey(englishRecord))
    if (!japaneseRecord) continue

    const englishVariants = englishRecord.English ?? []
    const japaneseVariants = japaneseRecord.Japanese ?? []
    const count = Math.min(englishVariants.length, japaneseVariants.length)
    for (let index = 0; index < count; index += 1) {
      const english = matcherWithOrder(englishVariants[index])
      const japanese = matcherWithOrder(japaneseVariants[index])
      const japanesePositionById = new Map(
        japanese.variableIds.map((id, position) => [id, position])
      )
      const valueOrder = english.variableIds.map(id => japanesePositionById.get(id))
      if (valueOrder.some(position => position === undefined)) continue
      const valueConditions = japanese.variableIds.map(id => {
        const condition = japaneseVariants[index].condition?.[id] ?? {}
        return {
          min: condition.min ?? null,
          max: condition.max ?? null
        }
      })
      const hasValueConditions = valueConditions.some(condition =>
        condition.min !== null || condition.max !== null)

      for (const { stat } of canonicalCandidates(
        englishRecord,
        canonicalByMatcher,
        english.matcher
      )) {
        for (const localized of localizedClientMatchers(japanese.matcher)) {
          const entry = {
            localized: localized.matcher,
            canonical: english.matcher,
            canonicalRef: stat.ref,
            statIds: [...englishRecord.ids],
            valueOrder: valueOrder.map(position => /** @type {number} */ (position))
          }
          if (hasValueConditions) entry.valueConditions = valueConditions
          if (localized.source) entry.source = localized.source
          output.push(entry)
        }
      }
    }
  }

  const unique = new Map(output.map(entry => [
    JSON.stringify(entry),
    entry
  ]))
  return [...unique.values()].sort((a, b) =>
    a.localized.localeCompare(b.localized, 'ja') ||
    a.canonical.localeCompare(b.canonical, 'en') ||
    a.canonicalRef.localeCompare(b.canonicalRef, 'en') ||
    JSON.stringify(a.statIds).localeCompare(JSON.stringify(b.statIds), 'en')
  )
}

export function renderTranslationVariant (variant) {
  return renderVariant(variant)
}
