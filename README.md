<h1 align="center">
Generi
</h1>
<p align="center">
  <img src="./.github/logo.png" height="230">
</p>
<h4 align="center">
A Versioning Generator for JavaScript Projects.
<h4>
<p align="center">
  <a href="https://www.npmjs.com/package/generi"><img src="https://img.shields.io/npm/v/generi?style=for-the-badge&color=a0a3cf&label="></a>
<p>

<br>
<br>

- ✅ Easy CLI
- ✅ Monorepo support with [Lerna](https://lerna.js.org/)
- ✅ Release support with [Github CLI](https://cli.github.com/)
- ✅ Supports Node v18+

### Install

`npm i -g generi` or `yarn global add generi`

### Usage

#### `generi init`

Init `generi.json` configuration, and, if necessary, a git project
<br>

#### `generi log <target> <-p prerelease>`

Generate CHANGELOG.md and the necessary contents

`generi log patch` 0.1.0 >> 0.1.1

`generi log minor` 0.1.0 >> 0.2.0

`generi log major` 0.1.0 >> 1.0.0

`generi log prepatch` 0.1.0 >> 0.1.1-beta.0

`generi log preminor` 0.1.0 >> 0.2.0-beta.0

`generi log premajor` 0.1.0 >> 1.0.0-beta.0

`generi log premajor -p alpha` 0.1.0 >> 1.0.0-alpha.0
<br>

#### `generi revert`

Revert `generi log` last command
<br>

### Monorepo

Monorepo versions may depend on external tools. Given this, Generi supports lerna workspaces, using the command `lerna version` before creating the changelog. In other setups, we recommend disabling the `tag` and `version` options.

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

##### `push` Default: `false`

Push commits in actually branch after log

##### `publish` Default: `false`

Publish(NPM) package in final log

##### `repository` Default: `undefined`

A URL to git repository for sha256 open link

##### `exclude` Default: `[" typo"]`

Invalidates commits in CHANGELOG.md that contain the considered options

##### `prerelease` Default: `beta`

Default 'canary', 'beta' or 'alpha' argument for prerelease log command