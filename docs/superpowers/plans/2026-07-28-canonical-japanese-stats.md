# Canonical English Stats Japanese Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 日本語mod入力をRePoE由来の対応表で英語matcherへ変換し、既存の英語stat・trade IDだけで解析・検索する。

**Architecture:** 生成時に英日RePoE翻訳をstat IDで結合して日本語→英語matcher候補表を作る。実行時は全言語で英語statsをロードし、日本語時のみ正規化候補を既存英語resolverへ渡す。

**Tech Stack:** TypeScript、Node.js、Node test runner、Vue 3、Vite、Electron Builder/NSIS、RePoE JSON。

## Global Constraints

- 英語 `stats.ndjson`、英語stat ref、英語trade IDを唯一の基準にする。
- 日本語mod文をstat IDまたはtrade IDへ直接照合しない。
- 日本語表示名とUI表示を維持する。
- 既存英語parser・filter・trade API payloadを回帰させない。
- GitHub書き込みにはローカル `gh` 認証を使う。

---

### Task 1: RePoE英日matcher対応表

**Files:**
- Test: `tools/repoe/generate-ja-stat-normalization.test.mjs`
- Create: `tools/repoe/stat-normalization.mjs`
- Create: `tools/repoe/generate-ja-stat-normalization.mjs`
- Create: `renderer/public/data/ja/stat-normalization.ndjson`
- Modify: `renderer/package.json`

**Interfaces:**
- Produces: `buildNormalizations(englishTranslations, japaneseTranslations, canonicalStats): StatNormalization[]`
- Produces: `npm run generate-ja-stat-normalization`

- [ ] fixtureで英日ID結合、`+#` format、変数語順、重複候補を示す失敗テストを書く。
- [ ] テストを実行し、module未実装で失敗することを確認する。
- [ ] stat ID一致、format展開、canonical matcher照合、valueOrder計算を実装する。
- [ ] テストを通し、実RePoEから正規化NDJSONを生成する。
- [ ] 代表3modと生成件数を検証する。

### Task 2: Canonical英語statローダー

**Files:**
- Test: `tools/repoe/verify-canonical-ja-stats.test.mjs`
- Modify: `renderer/src/assets/data/interfaces.ts`
- Modify: `renderer/src/assets/data/index.ts`
- Modify: `renderer/src/assets/make-index-files.mjs`
- Modify: `renderer/src/parser/stat-translations.ts`

**Interfaces:**
- Produces: `NORMALIZE_STAT_MATCH_STR(localized: string): StatNormalization[]`
- `tryParseTranslation` は候補の `canonical` と並べ替え済みrollを既存resolverへ渡す。

- [ ] 日本語statsが英語canonicalであることと代表候補を検査する失敗テストを書く。
- [ ] すべての言語で英語stats/indexをロードする。
- [ ] 日本語正規化表をロードし、matcher候補検索を提供する。
- [ ] parserで各候補を既存resolverへ渡し、表示matcherだけ日本語を保持する。
- [ ] 代表3modとexplicit/implicit/crafted/enchantの統合検証を通す。

### Task 3: 日本語表示と回帰

**Files:**
- Modify: `renderer/src/web/price-check/filters/create-stat-filters.ts`（必要な場合のみ）
- Modify: `renderer/public/data/ja/items.ndjson`
- Modify: `renderer/public/data/ja/app_i18n.json`
- Test: `tools/repoe/verify-ja-release-data.test.mjs`

**Interfaces:**
- canonical `Stat.trade.ids` は不変。
- `ParsedStat.translation` は日本語表示matcherを保持する。

- [ ] item `name`/`refName` と通貨 `tradeTag` の契約テストを書く。
- [ ] UI/resultが日本語matcherを表示することを検証する。
- [ ] renderer lint、型検査、buildを通す。
- [ ] main buildを通す。

### Task 4: Version・NSIS・GitHub Release

**Files:**
- Modify: `main/package.json`
- Modify: `main/package-lock.json`
- Generated: `main/dist/Awakened PoE Trade Setup <version>.exe`
- Generated: `main/dist/Awakened PoE Trade Setup <version>.exe.blockmap`
- Generated: `main/dist/latest.yml`

**Interfaces:**
- package、installer、release tagのversionを一致させる。

- [ ] 現在のfork最新release/tagを確認して衝突しないversionを決める。
- [ ] package versionとlockfileを同時更新する。
- [ ] renderer build、main build、`npm run package -- --win nsis`を実行する。
- [ ] installerの存在、version、SHA-256を確認する。
- [ ] 配布fork既定ブランチへコミット・pushし、tagとGitHub Releaseを作成する。
- [ ] installer、blockmap、latest.ymlをReleaseへ添付して公開状態を確認する。
