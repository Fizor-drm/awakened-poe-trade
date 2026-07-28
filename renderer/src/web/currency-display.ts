import { AppConfig } from './Config'
import { ITEMS_ITERATOR } from '@/assets/data'

const japaneseCurrencyNames: Record<string, string> = {
  alt: '改変のオーブ',
  alch: '錬金術のオーブ',
  annul: '消去のオーブ',
  blessed: '祝福のオーブ',
  chaos: 'カオスオーブ',
  chrome: '色彩のオーブ',
  divine: '神のオーブ',
  div: '神のオーブ',
  exalted: '高貴なオーブ',
  exa: '高貴なオーブ',
  fusing: '結合のオーブ',
  gcp: '宝石細工師のプリズム',
  mirror: 'カランドラの鏡',
  regal: '王者のオーブ',
  regret: '後悔のオーブ',
  vaal: 'ヴァールオーブ'
}

export function displayCurrency (currency: string) {
  if (AppConfig().language !== 'ja') return currency
  const tag = currency.toLowerCase()
  const staticName = japaneseCurrencyNames[tag]
  if (staticName) return staticName
  return currencyNameByTradeTag().get(tag) ?? currency
}

let cachedNames: Map<string, string> | undefined

function currencyNameByTradeTag () {
  if (!cachedNames) {
    cachedNames = new Map(Object.entries(japaneseCurrencyNames))
    for (const item of ITEMS_ITERATOR('"tradeTag":"')) {
      if (item.tradeTag) cachedNames.set(item.tradeTag.toLowerCase(), item.name)
    }
  }
  return cachedNames
}
