export interface StatNormalization {
  localized: string
  canonical: string
  canonicalRef: string
  statIds: string[]
  valueOrder: number[]
  valueConditions?: Array<{
    min: number | null
    max: number | null
  }>
  source?: 'client-alias'
}

interface StatValue {
  roll: number
}

function conditionsMatch (
  normalization: StatNormalization,
  values: StatValue[]
): boolean {
  if (!normalization.valueConditions) return true
  return normalization.valueConditions.every((condition, index) => {
    const value = values[index]?.roll
    if (value === undefined) return false
    return (
      (condition.min === null || value >= condition.min) &&
      (condition.max === null || value <= condition.max)
    )
  })
}

export function normalizeStatCandidates<T extends StatValue> (
  candidates: StatNormalization[],
  values: T[]
): Array<{
  matchStr: string
  values: T[]
  displayMatcher: string
  canonicalRef: string
}> {
  return candidates
    .filter(candidate => conditionsMatch(candidate, values))
    .sort((a, b) => Number(a.source === 'client-alias') - Number(b.source === 'client-alias'))
    .flatMap(candidate => {
      const ordered = candidate.valueOrder.map(index => values[index])
      if (ordered.some(value => value === undefined)) return []
      return [{
        matchStr: candidate.canonical,
        values: ordered,
        displayMatcher: candidate.localized,
        canonicalRef: candidate.canonicalRef
      }]
    })
}

export function localizedStatDisplay (
  canonical: string,
  localizedSources: string[]
): string {
  const unique = new Set(localizedSources)
  return (unique.size === 1) ? [...unique][0] : canonical
}
