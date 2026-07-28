const exact: Record<string, string> = {
  'Please wait…': 'しばらくお待ちください…',
  'Choose File': 'ファイルを選択',
  'Is ready and running in background': '準備完了（バックグラウンドで実行中）',
  seconds: '秒', League: 'リーグ', Realm: 'リージョン', International: '国際版',
  'Loading leagues…': 'リーグを読み込み中…', 'Failed to load leagues': 'リーグの読み込みに失敗しました',
  'Release notes': 'リリースノート', 'Report a bug on GitHub': 'GitHubで不具合を報告', Quit: '終了',
  'Support development on': '開発を支援', Blighted: 'ブライト化', 'Blight-ravaged': '荒廃したブライト',
  Magic: 'マジック', Superior: '上質', Anomalous: '異常', Divergent: '分岐', Phantasmal: '幻影',
  Map: 'マップ', Flask: 'フラスコ', Jewel: 'ジュエル', Ring: 'リング', Amulet: 'アミュレット', Belt: 'ベルト',
  Boots: 'ブーツ', Gloves: '手袋', Helmet: 'ヘルメット', Shield: 'シールド', Bow: '弓', Claw: 'クロー', Dagger: 'ダガー', Wand: 'ワンド', Staff: 'スタッフ', Sceptre: 'セプター',
  'No relevant stats were found': '関連するステータスが見つかりません', Hidden: '非表示', Collapse: '折りたたむ', Mods: 'モッド',
  Pseudo: '疑似', 'Base item': 'ベースアイテム', implicit: '暗黙', fractured: 'フラクチャー', crafted: 'クラフト', enchant: 'エンチャント', corrupted: '破損', explicit: '明示',
  'Offline & Online': 'オフラインを含む', 'In League': 'リーグ内', 'Merchant Only': '商人のみ', 'Any Currency': 'すべての通貨', 'Both Orbs': '両方のオーブ',
  hide: '隠す', edit: '編集', move: '移動', delete: '削除', 'add widget…': 'ウィジェットを追加…',
  Stopwatch: 'ストップウォッチ', paused: '停止中', 'Start and Pause': '開始／一時停止', Reset: 'リセット',
  Keys: 'キー', 'Stash search': 'スタッシュ検索', 'search text or regex': '検索テキストまたは正規表現', 'friendly name': '表示名',
  'Image strip': '画像ストリップ', 'Item search': 'アイテム検索', 'Search by name…': '名前で検索…', 'Reset items': 'アイテムをリセット',
  'Skill Gem': 'スキルジェム', Replicas: 'レプリカ', 'No items found.': 'アイテムが見つかりません。',
  'Map check': 'マップ確認', Profile: 'プロファイル', 'Only selected': '選択項目のみ',
  'Trade site request failed': '取引サイトへのリクエストに失敗しました', Trade: '取引', Price: '価格', Stock: '在庫', Seller: '販売者', Listed: '出品日時',
  'Last 7 days': '過去7日間', Stack: 'スタック', 'Market Ratio': '市場比率',
  'Settings - Awakened PoE Trade': '設定 - Awakened PoE Trade', Language: '言語', 'Account name': 'アカウント名', 'Last character name': '最後のキャラクター名',
  'Add command': 'コマンドを追加', 'Not Set': '未設定', Overlay: 'オーバーレイ', Hotkeys: 'ホットキー', Chat: 'チャット', General: '一般', Debug: 'デバッグ', About: '情報',
  'Font size': 'フォントサイズ', 'PoE log file': 'PoEログファイル', 'PoE config file': 'PoE設定ファイル', 'Restore clipboard': 'クリップボードを復元',
  'Price check': '価格チェック', 'Auto-hide Mode': '自動非表示モード', 'Open without auto-hide': '自動非表示なしで開く', 'Show seller': '販売者を表示',
  'Fill stat values': 'ステータス値を入力', 'Exact value': '正確な値', 'Show price prediction': '価格予測を表示'
}

Object.assign(exact, {
  heist: 'ハイスト', outdated: '旧式', Shaper: 'シェイパー', Elder: 'エルダー', Crusader: 'クルセイダー', Hunter: 'ハンター', Redeemer: 'リディーマー', Warlord: 'ウォーロード',
  'T16+': 'T16以上',
  'If this Item was introduced in this League, it will likely be supported in the next app update.': 'このアイテムが今リーグで追加されたものなら、次回のアプリ更新で対応される見込みです。',
  'You are trying to price check unidentified Unique item with base type "{0}". Which one?': 'ベースタイプ「{0}」の未鑑定ユニークを価格チェックしようとしています。どれですか？',
  'Rank: {0}': 'ランク: {0}', Implicit: '暗黙', Fractured: 'フラクチャー', Explicit: '明示', Crafted: 'クラフト', Scourge: 'スカージ', 'Foil Unique': 'フォイルユニーク', 'Foil {0}': 'フォイル {0}', Quiver: '矢筒',
  '{0} of {1}, stats': '{1}件中 {0}件のステータスを選択',
  'Crafted Chaos Resistance without Explicit mod has no value': '明示モッドのないクラフト済みカオス耐性には価値がありません',
  'Select only if price-checking as base item for crafting': 'クラフト用ベースアイテムとして価格チェックする場合のみ選択',
  'Select only if item has 6 modifiers (1 of which is crafted) or if it has 5 modifiers': 'モッドが6個（うち1個はクラフト済み）または5個の場合のみ選択',
  scourge: 'スカージ', variant: 'バリエーション', synthesised: '合成', foulborn: 'フォールボーン', eldritch: 'エルドリッチ', pseudo: '疑似', not: '除外', Delve: 'デルヴ', Incursion: 'インカージョン', Mercenary: '傭兵', Essence: 'エッセンス',
  'widget title': 'ウィジェットタイトル',
  'Wording of some stats has been changed. Check and update dangerous map mods in the settings. (This message will be hidden as soon as you remove all outdated stats)': '一部ステータスの文言が変更されました。設定で危険なマップモッドを確認・更新してください。（旧式ステータスをすべて削除すると、このメッセージは非表示になります）',
  Level: 'レベル', Quality: '品質', 'from poe.ninja …': 'poe.ninja から…',
  'Background when the Overlay is clickable': 'オーバーレイをクリック可能にしたときの背景', Transparent: '透明', 'Clicking on the background focuses the game': '背景をクリックするとゲームにフォーカスする',
  'Show a notification when the Overlay detects a PoE window': 'オーバーレイがPoEウィンドウを検出したときに通知する',
  'I am aware that future releases can potentially contain malicious code that can steal my POESESSID.': '今後のリリースにはPOESESSIDを盗む悪意あるコードが含まれる可能性があることを理解しています。',
  'Settings below are a compromise between increasing load on PoE website and convenient price checking / more accurate search.': '以下の設定は、PoE公式サイトへの負荷と価格チェックの利便性・検索精度のバランスを取るものです。',
  Add: '追加', Remove: '削除', Save: '保存', Cancel: 'キャンセル', Close: '閉じる', Browser: 'ブラウザ', Disabled: '無効', Refresh: '更新', Retry: '再試行', Search: '検索', Select: '選択', 'Restart required': '再起動が必要です',
  Online: 'オンライン', Offline: 'オフライン', Error: 'エラー', 'Not recognized modifier': '認識できないモッド', No: 'いいえ', Yes: 'はい', You: 'あなた',
  '1 Empty or Crafted Modifier': '空きまたはクラフト済みモッドが1個', Any: '任意', Prefix: '接頭辞', Suffix: '接尾辞',
  'Find in Stash': 'スタッシュ内を検索', 'An error occurred while parsing the item': 'アイテム解析中にエラーが発生しました',
  'This is probably a bug and you can report it on GitHub.': 'これは不具合の可能性があります。GitHubで報告してください。',
  'Unknown Item': '不明なアイテム', 'Open item on wiki': 'Wikiでアイテムを開く', 'Open item on PoEDB': 'PoEDBでアイテムを開く',
  'Open base item on Craft of Exile': 'Craft of Exileでベースアイテムを開く', 'Item info': 'アイテム情報', Corrupted: '破損', Unidentified: '未鑑定', Veiled: '覆い隠し', Mirrored: '複製', Split: '分裂',
  'Abyss Jewel': 'アビスジュエル', 'Body Armour': '胴装備', 'Fishing Rod': '釣り竿', 'Rune Dagger': 'ルーンダガー', Warstaff: 'ウォースタッフ',
  'Cluster Jewel': 'クラスタージュエル', 'Heist Blueprint': 'ハイスト設計図', 'Heist Contract': 'ハイスト契約書', 'Heist Tool': 'ハイストツール', 'Heist Brooch': 'ハイストブローチ', 'Heist Gear': 'ハイスト装備', 'Heist Cloak': 'ハイストクローク', Trinket: 'トリンケット', 'Sanctum Relic': 'サンクタムレリック', Tincture: 'ティンクチャー', Charm: 'チャーム', Idol: 'アイドル', Graft: 'グラフト',
  'Stats ignored': 'ステータスを無視', 'Roll is not variable': 'ロール値は固定', 'Elemental damage is not the main source of DPS': '元素ダメージは主なDPS源ではありません', 'Physical damage is not the main source of DPS': '物理ダメージは主なDPS源ではありません',
  'Filtering by exact Elemental Resistance unreasonably increases the price': '元素耐性を厳密指定すると価格が不当に上がります', 'Buyer will likely change anointment': '購入者はアノイントを変更する可能性があります',
  'Any Currency': 'すべての通貨', 'Chaos Orb': 'カオスオーブ', 'Divine Orb': '神聖のオーブ',
  'You may have an outdated version': '古いバージョンを使用している可能性があります', 'You have the latest version': '最新バージョンです', 'Error while checking for updates': 'アップデート確認中にエラーが発生しました', 'Checking for updates': 'アップデートを確認中', 'Downloading…': 'ダウンロード中…',
  'Open the Downloads page': 'ダウンロードページを開く', 'You have disabled automatic updates download': '自動アップデートのダウンロードは無効です',
  'Heist target:': 'ハイストターゲット:', 'Replicas': 'レプリカ', 'Map check': 'マップ確認', 'Only selected': '選択項目のみ',
  bulk: 'まとめ買い', Fulfill: '取引を完了', 'iLvl': 'アイテムLv', 'Market Ratio': '市場比率',
  'or Private League': 'またはプライベートリーグ', 'Last character name': '最後のキャラクター名', 'press Enter': 'Enterを押す', 'You can clear hotkey by pressing Backspace': 'Backspaceでホットキーを解除できます',
  'Stash tab scrolling': 'スタッシュタブのスクロール', 'Grid for Delve Chart': 'デルヴチャートのグリッド', 'PoE window title': 'PoEウィンドウタイトル', 'App development continues thanks to:': 'アプリ開発への協力:',
  'Record all key presses': 'すべてのキー入力を記録', 'Force the English version of the site': '公式サイトの英語版を強制する',
  'Enable builtin browser': '内蔵ブラウザを有効化', 'Your items will be highlighted even if this setting is off': 'この設定をオフにしてもアイテムはハイライトされます',
  'Show memorized cursor position': '記憶したカーソル位置を表示', 'Extra time to prevent spurious Rate limiting': '不要なレート制限を防ぐための追加待機時間',
  'Show indication on collapsed listings': '折りたたまれた出品にも表示する', 'Perform an auto search, when pressing': 'キーを押したときに自動検索する'
})

const phrases: Array<[RegExp, string]> = [
  [/^Press (.+) to continue editing\.$/, '$1 を押して編集を続けてください。'],
  [/^This tool relies on (.+), consider supporting them as well$/, 'このツールは $1 に依存しています。あわせて支援をご検討ください。'],
  [/^Press (.+) to switch between browser and game\.$/, '$1 を押してブラウザとゲームを切り替えます。'],
  [/^Contact me on one of the PoE Discords,$/, 'PoE Discordでお問い合わせください。'],
  [/^Failed to load leagues$/, 'リーグの読み込みに失敗しました'],
  [/^Make sure the realm is not under maintenance\.(.*)$/, 'リージョンがメンテナンス中でないことを確認してください。$1'],
  [/^Q (.+)%$/, '品質 $1%'], [/^Base Percentile: (.+)%$/, 'ベース百分位: $1%'],
  [/^Armour: /, 'アーマー: '], [/^Evasion Rating: /, '回避力: '], [/^Energy Shield: /, 'エナジーシールド: '], [/^Ward: /, 'ウォード: '], [/^Block: /, 'ブロック: '],
  [/^Total DPS: /, '合計DPS: '], [/^Physical DPS: /, '物理DPS: '], [/^Elemental DPS: /, '元素DPS: '], [/^Critical Strike Chance: /, 'クリティカル率: '], [/^Attacks per Second: /, '秒間アタック回数: '],
  [/^Item Quantity: /, 'アイテム数量: '], [/^Item Rarity: /, 'アイテムレアリティ: '], [/^Monster Pack Size: /, 'モンスターパックサイズ: '],
  [/^Requires (.+) \(Level (.+)\)$/, '$1 が必要（レベル $2）'], [/^Heist Target: /, 'ハイストターゲット: '], [/^Wings Revealed: /, '公開済みウィング: '],
  [/^Links: /, 'リンク: '], [/^White: /, '白: '], [/^Memory Strands: /, '記憶の糸: '], [/^Charge: /, 'チャージ: '],
  [/^Category: /, 'カテゴリ: '], [/^(.+) Jewel$/, '$1 ジュエル'], [/^One-Handed (.+)$/, '片手 $1'], [/^Two-Handed (.+)$/, '両手 $1'],
  [/^(.+) Ago$/, '$1前'], [/^Listed: Any Time$/, '出品: 期間指定なし'], [/^Tier (.+)$/, 'ティア $1'],
  [/^(.+) Modifier$/, '$1モッド'], [/^Not (.+)$/, '$1ではない'], [/^Show icon for new mods$/, '新しいモッドのアイコンを表示'],
  [/^Matched: /, '一致: '], [/^Getting price from poe\.ninja …$/, 'poe.ninja から価格を取得中…'],
  [/^You have$/, '所持数'], [/^This item is available on the Currency Exchange Market$/, 'このアイテムは通貨取引所で利用できます'],
  [/^Last checked: never$/, '最終確認: 未実行'], [/^It will be installed automatically on exit$/, '終了時に自動インストールされます'],
  [/^You can download it from GitHub$/, 'GitHubからダウンロードできます'], [/^Check now$/, '今すぐ確認'], [/^Install now$/, '今すぐインストール'],
  [/^Show button for active widgets$/, '有効なウィジェットのボタンを表示'], [/^Price check \(Ctrl \+ V\)$/, '価格チェック（Ctrl + V）'],
  [/^Too many items found, enter the name more precisely\.$/, 'アイテムが多すぎます。より正確な名前を入力してください。'],
  [/^Perform an OCR for a Skill Gem$/, 'スキルジェムをOCRで読み取る'], [/^Item has no modifiers\.$/, 'アイテムにモッドはありません。'],
  [/^Stat \(found: (.+)\)$/, 'ステータス（検出: $1）'], [/^Show seller$/, '販売者を表示'], [/^Always select "Stock" filter$/, '常に「在庫」フィルターを選択'],
  [/^Remember the Buyout Currency filter$/, '購入通貨フィルターを記憶する']
]

export function translateJapaneseUi (message: string) {
  if (exact[message]) return exact[message]
  for (const [pattern, replacement] of phrases) {
    if (pattern.test(message)) return message.replace(pattern, replacement)
  }
  return message
    .replace(/^Item Level: /, 'アイテムレベル: ')
    .replace(/^Quality: /, '品質: ')
    .replace(/^Level: /, 'レベル: ')
    .replace(/^Tier: /, 'ティア: ')
    .replace(/^Map Tier: /, 'マップティア: ')
    .replace(/^Area Level: /, 'エリアレベル: ')
    .replace(/^Stock: /, '在庫: ')
    .replace(/^Price /, '価格 ')
    .replace(/^Getting price /, '価格を取得中: ')
    .replace(/^Last checked: /, '最終確認: ')
    .replace(/^Update available: /, 'アップデートがあります: ')
    .replace(/^Version /, 'バージョン ')
}
