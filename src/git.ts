import execa from 'execa';
import fs from 'fs-extra';
import path from 'pathe';
import { versionBump } from 'bumpp';
import { glob } from 'tinyglobby';
import type {
	Commit,
	GeneriConsole,
	GitNewTag,
	GitPrerelease,
	Root,
} from './types';
import { getRoot, setFile, getFile, getFileRoot } from './utils';
import { isChangesForCommit } from './utils';
import { destr } from 'destr';

export const isGit = () => {
	return fs.existsSync(path.resolve(getRoot(), '.git'));
};

const parseLogMessage = (raw: string): Commit => {
	const parts = raw.match(/hash<(.+)> ref<(.*)> message<(.*)> date<(.*)>/) || [];

	return {
		sha: parts[1],
		refName: parts[2].split(',').map((i) => i.trim()),
		summary: parts[3],
		date: parts[4],
	};
};

export const parseCommitSummary = (commit: Commit) => {
	const parts = commit.summary.match(/(feat|fix|ci)((.+)): (.*)/) || [];

	return parts;
};

export const commits = (): Commit[] => {
	return execa
		.sync('git', ['log', '--oneline', '--pretty=hash<%h> ref<%D> message<%s> date<%cd>'])
		.stdout.split('\n')
		.map(parseLogMessage);
};

export const existsTag = (): boolean => {
	try {
		return !!execa.sync('git', ['describe', '--abbrev=0', '--tags']);
	} catch (e) {
		return false;
	}
};

export const lastTag = (): string => {
	let last;

	try {
		last = execa.sync('git', ['describe', '--abbrev=0', '--tags']);
	} catch (e) {}
	if (!last) {
		return '';
	}

	return last?.stdout || '';
};

export const ConventionalChangelogNewCommits = () => {
	return newCommits().filter((commit) => parseCommitSummary(commit));
};

export const newCommits = (): Commit[] => {
	const arr: any = [];
	let old = false;

	commits().forEach((commit) => {
		if (old) return;

		if (isTagCommit(commit)) {
			old = true;
			return;
		}

		arr.push(commit);
	});

	return arr;
};

export const isTagCommit = (commit: Commit) => {
	return commit.refName.find((ref) => ref.includes('tag'));
};

export const getTagCommit = (commit: Commit) => {
	return commit.refName.filter((ref) => ref.includes('tag'))[0].replace('tag: ', '');
};

export const setVersion = (
	target: string,
	{ config, console }: Root,
	tag: GitNewTag,
	prerelease?: GitPrerelease
) => {
	const normalize = target.substring(1);
	let lerna = getFile(getFileRoot(config.lernaPath));

	// monorepo with lerna
	if (lerna) {
		console.info(`Executing <lerna version ${tag}> command...`);

		try {
			const asPrerelease = prerelease ? ['--preid', prerelease] : [];

			execa.sync('lerna', [
				'version',
				tag,
				...asPrerelease,
				'--no-private',
				'--no-changelog',
				'--no-git-tag-version',
				'--no-push',
				'--yes',
				'--force-publish',
			]);
		} catch (e) {
			console.error(`Could not execute <lerna version ${tag}> command`);
		}

		const lernaPrev = destr<Record<string, unknown>>(lerna);
		const lernaPost = destr<Record<string, unknown>>(
			getFile(getFileRoot(config.lernaPath))
		);

		// if lerna version has no previous workspace changes, it does not execute any command to change the version.
		if (lernaPrev.version === lernaPost.version) {
			const _lerna = lernaPrev;
			_lerna.version = normalize;

			setFile(getFileRoot(config.lernaPath), _lerna);
		}

		console.success('Set ' + target + ' Version In Lerna Monorepos!');
	} else {
		// TODO: custom pnpm-workspace.yaml packages list
		glob(['package.json', './packages/*/package.json'], {
			expandDirectories: false,
		}).then(async (packages) => {
			await versionBump({
				files: packages,
				commit: false,
				push: false,
				tag: false,
				confirm: false,
				noVerify: true,
			});
		});
	}
};

export const setTag = (target: string, console: GeneriConsole) => {
	const tags = execa.sync('git', ['tag', '-n']);

	if (tags.stdout?.includes(target)) {
		console.error('Tag already exists!');
	}

	const tag = execa.sync('git', ['tag', target]);

	if (!tag) {
		console.error('Tag already exists!');
	}

	console.success(target + ' Git Tag');
};

export const initGit = (console: GeneriConsole) => {
	const init = execa.sync('git', ['init']);

	if (!init) {
		console.error('Git is not installed.');
	}

	console.success('Initialized Git Project');

	execa.sync('git', ['add', '-A']);

	console.success('Added All Staged Changes');

	execa.sync('git', ['commit', '-m', 'chore(changelog): initial content']);

	console.success(
		'Commit Initial Content With Message: chore(changelog): initial content'
	);
};

export const setCommit = (message: string, log = true, console: GeneriConsole) => {
	execa.sync('git', ['add', '-A']);

	execa.sync('git', ['commit', '-m', message]);

	if (log) console.success('Commit With Message: ' + message);
};

export const pushCommits = ({ config, console }: Root) => {
	if (!config.push) return;

	console.info(`Pushing...`);

	const target = execa.sync('git', ['branch', '--show']);

	execa.sync('git', ['push', 'origin', target?.stdout || 'main']);

	execa.sync('git', ['push', '--tags']);

	console.success('Success in Push!');
};

export const revertAll = (console: GeneriConsole) => {
	if (!isGit()) console.error('This command just rolls back changes in git.');

	isChangesForCommit(isGit(), console);

	if (!verifyExistentRemote())
		console.error(
			'No remotes were found! Use git remote add origin <github|gitlab|gitbucket repository> instead.'
		);

	const tag = lastTag();

	execa.sync('git', ['reset', 'HEAD~1']);

	execa.sync('git', ['tag', '--delete', tag]);

	execa.sync('git', ['checkout', '.']);

	console.success(`Success in revert ${tag} tag!`);
};

export const verifyExistentRemote = () => {
	try {
		execa.sync('git', ['remote', '-v']);
	} catch (e) {
		return false;
	}

	return true;
};

export const isValidTag = (tag: GitNewTag) => {
	return (
		tag === 'patch' ||
		tag === 'prepatch' ||
		tag === 'minor' ||
		tag === 'preminor' ||
		tag === 'major' ||
		tag === 'premajor'
	);
};

export const isCleanChanges = (): boolean => {
	const changes = execa.sync('git', ['diff', 'HEAD']);

	return !changes.stdout;
};

export const getRemoteOrigin = () => {
	const link =
		execa.sync('git', ['config', '--get', 'remote.origin.url'])?.stdout || undefined;

	return link;
};
