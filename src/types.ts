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

export type GitNewTag = 'patch' | 'minor' | 'major';

export interface GitNewTagOptions {
	last: string;
	tag: GitNewTag;
	unreleased?: 'alpha' | 'beta';
}

export interface LogOptions {
	header: boolean;
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
