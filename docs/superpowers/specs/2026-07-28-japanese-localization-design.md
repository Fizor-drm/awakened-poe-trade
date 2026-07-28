# Awakened PoE Trade 日本語完全対応 設計

## 目的

PoE 1 日本語クライアントのクリップボードを確実に解析し、日本語UIのまま、本家Awakened PoE Tradeと同じ英語stat・英語trade IDで価格検索する。

## 不変条件

- `renderer/public/data/en/stats.ndjson` をstat、matcher、trade IDの唯一のcanonicalデータにする。
- 日本語mod文をtrade IDへ直接照合しない。
- 日本語は、入力正規化、アイテム・通貨名、UI・結果表示にだけ使用する。
- 既存の英語パーサー、filter生成、trade API payloadを変更しない。
- 日本語以外の既存言語の挙動を維持する。

## アーキテクチャ

ビルド時にRePoEの英語・日本語 `stat_translations.json` を、同一のstat ID配列で結合する。各翻訳variantについて、変数番号を保持したまま英語matcherと日本語matcherを対にし、canonical英語 `stats.ndjson` に実在するmatcherだけを `ja/stat-normalization.ndjson` に出力する。

実行時のstatローダーは言語にかかわらず英語 `stats.ndjson` と英語索引をロードする。日本語の場合だけ正規化表もロードし、日本語mod行から得たplaceholder matcherを英語matcher候補へ変換する。候補は既存の英語group resolverへ渡し、mod種別・item category・roll条件による選択を既存ロジックに委ねる。

UI表示用のstat名はcanonical `Stat` に日本語表示matcherを関連付けて保持する。解析・filter・trade queryではcanonical英語matcherと英語trade IDを使い、画面には入力した日本語matcherを表示する。アイテムは既存の `name`（日本語）と `refName`（英語）を維持し、通貨は日本語表示名と既存trade tagを維持する。

## データ契約

`ja/stat-normalization.ndjson` の1行は次の契約とする。

```ts
interface StatNormalization {
  localized: string
  canonical: string
  canonicalRef: string
  statIds: string[]
  valueOrder: number[]
  source?: "client-alias"
}
```

- `localized`: 数値を `#` に置換した日本語client matcher。
- `canonical`: 英語 `stats.ndjson` に存在するmatcher。
- `canonicalRef`: canonical英語stat ref。生成時検証と曖昧候補の診断に使う。
- `statIds`: RePoE英日結合に使ったstat ID群。trade IDではない。
- `valueOrder`: 英語placeholder順に並べるための日本語placeholder index。
- `source`: RePoE文から機械的に導出したclient短縮表記だけに付与する。直接matcherを常に優先する。

同じ日本語matcherに複数候補がある場合は全候補を保持し、実行時に英語resolverで決定する。手書きの個別stat aliasは作らない。

## データフロー

1. 日本語クリップボードを既存のsection parserが分解する。
2. mod行の数値・roll範囲を既存placeholder parserが抽出する。
3. 日本語placeholder matcherを正規化表で英語matcher候補へ変換し、値を `valueOrder` で並べ替える。
4. 既存の英語 `STAT_BY_MATCH_STR_V2` とresolverでcanonical `Stat` を得る。
5. 既存のmodifier集約・filter生成・trade queryが英語trade IDを使用する。
6. UIは日本語matcher、アイテム日本語名、通貨日本語名を表示する。

## エラー処理

- 英日RePoEのstat IDが一致しないrecordは生成を失敗させる。
- canonical英語matcherに結び付かない翻訳は件数と例を報告するが、trade対象外の翻訳があるため生成全体は失敗させない。
- 同一localized matcherの重複候補は保持する。完全に同一の候補だけを重複排除する。
- 日本語正規化データのロードに失敗した場合は初期化を失敗させ、英語trade IDへ安全に到達できない状態で検索しない。
- 認識できないmodは既存どおりUIに表示し、推測でtrade IDを選ばない。

## 検証

- 生成器の英日ID結合、format展開、placeholder順序、重複候補をNodeテストで検証する。
- `アーマーが75(68-79)%増加する`、`アーマー +98(83-101)`、`冷気耐性 +32(30-35)%` が期待する英語matcher・英語trade IDへ到達することを検証する。
- 明示、暗黙、クラフト、エンチャントを含む日本語item fixtureをparseし、unknown modifierにならないことを検証する。
- 英語statsのhash索引、renderer型検査・build、main build、NSIS packageを検証する。
- package version、`latest.yml`、installer名を同一versionにし、SHA-256を記録する。

## リリース

配布フォークの既定ブランチを基準に変更をコミットし、tagをpushする。Windows NSIS installer、blockmap、`latest.yml` を同じGitHub Releaseへ添付する。GitHub書き込みはローカル `gh` 認証を使う。
