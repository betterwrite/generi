<p align="center">
  <img src="./.github/logo.png" height="230">
</p>

<h1 align="center">
Generi
</h1>
<h4 align="center">
A Simple CHANGELOG.md Generator for JavaScript / TypeScript Projects.
<h4>
<p align="center">
  <a href="https://www.npmjs.com/package/generi"><img src="https://img.shields.io/npm/v/generi?style=for-the-badge&color=a0a3cf&label="></a>
  <a href="https://www.npmjs.com/package/generi"><img src="https://img.shields.io/github/workflow/status/Novout/generi/Tests?style=for-the-badge&color=5BBB74&"></a>
  <a href="https://www.npmjs.com/package/generi"><img src="https://img.shields.io/github/license/Novout/generi?style=for-the-badge&color=a0a3cf&label="></a>
<p>

<br>
<br>

![Build Status](https://img.shields.io/github/workflow/status/Novout/generi/Tests)

### Install

`npm i -g generi` `yarn global add generi`
### Basic Usage

To initialize generi, use `generi init`

To generate a release, use `generi log <release>`

`generi log patch` 0.1.0 >> 0.1.1

`generi log minor` 0.1.0 >> 0.2.0

`generi log major` 0.1.0 >> 1.0.0

### Monorepo

Monorepo versions may depend on external tools. Given this, `monorepo: true` just generates the CHANGELOG.md without changing the versioning

`generi.json`
```json
"monorepo": true
```

##### Example with lerna

`lerna version patch && generi log patch`

### generi.json

##### `silent` Default: `false`

Do not emit any message in console

##### `commits` Default: `"none"`

Default format content in CHANGELOG.md

Options: `none` | [`conventional-commits`](https://www.conventionalcommits.org/en/v1.0.0/)

##### `tag` Default: `true`

Release a git tag

##### `version` Default: `true`

Insert new version in package.json

##### `monorepo` Default: `false`

Monorepo versions may depend on external tools. Given this, `monorepo: true` just generates the CHANGELOG.md without changing the versioning. This option ignores `tag` and `version` options

##### `push` Default: `false`

Push commits in actually branch after log

### Commands

#### `generi init`

Init generi configurations, and, if necessary, a git project

#### `generi log <patch|minor|major>`

Generate CHANGELOG.md and the necessary contents
