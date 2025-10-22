export type Maybe<T> = T | undefined | null | false;

export interface Commit {
	sha: string;
	refName: string[];
	summary: string;
	date: string;
}

export interface ConventionalCommit {
	raw: string;
	tag: string;
	type: string;
}

export type GitNewTag =
	| 'patch'
	| 'prepatch'
	| 'minor'
	| 'preminor'
	| 'major'
	| 'premajor';

export type GitPrerelease = 'alpha' | 'beta' | 'canary';

export interface GitLogOptions {
	prerelease?: GitPrerelease;
}

export interface GitNewTagOptions {
	last: string;
	tag: GitNewTag;
	prerelease?: GitPrerelease;
}

export interface LogOptions {
	header: boolean;
	git: GitLogOptions;
	init?: boolean;
}

export interface GeneriOptions {
	/* repository url for sha link generate. */
	repository?: string;

	/* Do not emit any message in console. */
	silent: boolean;

	/* default commit messages */
	commits: string;

	/* release a git tag */
	tag: boolean;

	/* release a version in package.json */
	version: boolean;

	/* push commits in actually branch after log */
	push: boolean;

	/* publish in npm */
	publish: boolean;

	/* release version with gh release command */
	release: boolean;

	/* exclude commits */
	exclude?: string[];

	/* default 'beta' or 'alpha' argument for pre(patch|minor|major) log command */
	prerelease?: GitPrerelease;

	/* package.json custom path. default option.cwd + ./package.json */
	packagePath?: Maybe<string>;

	/* lerna.json custom path. default option.cwd + ./lerna.json */
	lernaPath?: Maybe<string>;
}

export type GeneriConventionalCommits =
	| 'feat'
	| 'fix'
	| 'build'
	| 'chore'
	| 'ci'
	| 'docs'
	| 'style'
	| 'refactor'
	| 'perf'
	| 'test';

export type GeneriEmoticon = [GeneriConventionalCommits, string];
