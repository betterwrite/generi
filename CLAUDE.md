# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**generi** is a CLI tool (`generi` binary) that generates `CHANGELOG.md` files from git history. It bumps versions in `package.json`/`lerna.json`, creates git tags, and can push/publish/release — all driven by a `generi.config.ts` (or `.js`) file in the user's project.

## Commands

```bash
pnpm build          # compile with tsup → dist/
pnpm dev            # build then run via node .
pnpm test           # vitest run with coverage
pnpm test:dev       # vitest watch mode
pnpm format         # prettier on src/ and tests/
```

Run a single test file:
```bash
pnpm vitest run tests/git.test.ts
```

Self-test generi on this repo:
```bash
pnpm patch   # build + generi log patch
pnpm minor   # build + generi log minor
pnpm major   # build + generi log major
```

## Architecture

### Entry point
`src/index.ts` — registers CLI commands via **sade**. Four commands: `log`, `init`, `revert`, `test`.

### Config loading
`src/generi.ts` — uses **c12** to load `generi.config.ts|js` from the user's CWD. Falls back to `src/defines/generi-default.json`. The `repository` option can be `"force"` (auto-detect from git remote), `"ignore"`, or an explicit URL.

### Core flow (`generi log <patch|minor|major|...>`)
`src/commands/log.ts` orchestrates everything:
1. Reads version from `lerna.json` or `package.json`
2. Computes next version via `src/tag.ts` (wraps semver logic)
3. Calls `src/changelog.ts` → reads all git commits, formats them, writes `CHANGELOG.md`
4. Optionally bumps version (`src/git.ts → setVersion`) — lerna path uses `lerna version`, pnpm/npm path uses **bumpp**
5. Creates git tag, commits, pushes, releases, publishes per config flags

### Git operations
`src/git.ts` — all git interaction via **execa** sync calls. `commits()` parses `git log --pretty=hash<%h> ref<%D> message<%s> date<%cd>`. `newCommits()` returns only commits since the last tag.

### Cargo.toml support

`src/cargo.ts` — TOML read/write using **smol-toml**. Detects two layouts:
- **Single-crate**: `[package] version = "..."` at the root
- **Workspace**: `[workspace.package] version = "..."` at the root (member crates use `version.workspace = true`)

`readCargo(path)` returns the parsed TOML object or `false` if the file doesn't exist. `getCargoVersion(path)` extracts the version string. `setCargoVersion(path, version)` writes the new version back, preserving the rest of the file via stringify round-trip.

Detection priority in `commands/log.ts`: lerna.json → package.json → Cargo.toml. `setVersion` in `git.ts` shortcuts to the Cargo path when neither `package.json` nor `lerna.json` is present.

### Monorepo detection
`src/monorepo.ts` — detects package manager (pnpm/yarn/bun/npm) and whether lerna/nx is present. PNPM workspace packages are globbed from `pnpm-workspace.yaml`.

### Changelog generation
`src/changelog.ts` — two commit modes controlled by `config.commits`:
- `"conventional-commits"` — parses `type: message` format, adds emoji prefixes, skips non-conforming commits
- `"none"` (default) — includes all commits as plain bullets

Commits matching any string in `config.exclude` are skipped (default: `[" typo"]`).

## Config (`GeneriOptions`)

Key options users put in `generi.config.ts`:

| Option | Default | Effect |
|---|---|---|
| `repository` | `"force"` | URL for commit SHA links; `"force"` = auto-detect; `"ignore"` = no links |
| `commits` | `"none"` | `"none"` or `"conventional-commits"` |
| `tag` | `true` | Create git tag |
| `version` | `true` | Bump version in package.json/lerna.json |
| `push` | `true` | Push commits + tags |
| `publish` | `false` | `npm publish` |
| `release` | `false` | `gh release create` |
| `exclude` | `[" typo"]` | Commit summaries containing these strings are skipped |
| `packagePath` | `"package.json"` | Custom path to package.json |
| `lernaPath` | `"lerna.json"` | Custom path to lerna.json |
| `cargoPath` | `"Cargo.toml"` | Custom path to Cargo.toml |
