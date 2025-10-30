import { $ } from 'zx';
import { success, error, info } from './console';
import { Commit, GitNewTag, GitPrerelease } from './types';
import { getRoot, setFile, getFile, getPackageRoot, getLernaRoot } from './utils';
import fs from 'fs-extra';
import path from 'pathe';
import { getGeneriConfig } from './generi';
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
	return $.sync`git log --oneline --pretty=hash<%h> ref<%D> message<%s> date<%cd>`.stdout
		.split('\n')
		.map(parseLogMessage);
};

export const lastTag = (): string => {
	let last;

	try {
		last = $.sync`git describe --abbrev=0 --tags`;
	} catch (e) {}
	if (!last) {
		error('Unable to fetch the last tag. First use the generi init command');
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
	tag: GitNewTag,
	prerelease?: GitPrerelease
) => {
	const normalize = target.substring(1);
	let lerna = getFile(getLernaRoot());

	// monorepo with lerna
	if (lerna) {
		info(`Executing <lerna version ${tag}> command...`);

		try {
			const asPrerelease = prerelease ? ['--preid', prerelease] : [];

			$.sync`lerna version ${tag} ${asPrerelease.join(' ')} --no-private --no-changelog --no-git-tag-version --no-push --yes --force-publish`;
		} catch (e) {
			error(`Could not execute <lerna version ${tag}> command`);
		}

		const lernaPrev = destr<Record<string, any>>(lerna);
		const lernaPost = destr<Record<string, any>>(getFile(getLernaRoot()));

		// if lerna version has no previous workspace changes, it does not execute any command to change the version.
		if (lernaPrev.version === lernaPost.version) {
			const _lerna = lernaPrev;
			_lerna.version = normalize;

			setFile(getLernaRoot(), _lerna);
		}

		success('Set ' + target + ' Version In Lerna Monorepos!');
	} else {
		let pkg = getFile(getPackageRoot());

		if (!pkg) {
			error('<package.json> not exists!');
			return;
		}

		pkg = destr(pkg);

		if (pkg.version) {
			pkg.version = normalize;
		} else {
			if (pkg.name) {
				const name = pkg.name;

				delete pkg['name'];

				pkg = {
					name,
					version: normalize,
					...pkg,
				};
			} else {
				pkg = {
					version: normalize,
					...pkg,
				};
			}
		}

		setFile('package.json', pkg);

		success('Set ' + pkg.version + ' Version In package.json');
	}
};

export const setTag = (target: string) => {
	const tags = $.sync`git tag -n`;

	if (tags.stdout?.includes(target)) {
		error('Tag already exists!');
		return;
	}

	const tag = $.sync`git tag ${target}`;

	if (!tag) {
		error('Tag already exists!');
		return;
	}

	success(target + ' Git Tag');
};

export const initGit = () => {
	const init = $.sync`git init`;

	if (!init) {
		error('Git is not installed.');
		return;
	}

	success('Initialized Git Project');

	$.sync`git add -A`;

	success('Added All Staged Changes');

	$.sync`git commit -m "chore(changelog): initial content"`;

	success('Commit Initial Content With Message: chore(changelog): initial content');
};

export const setCommit = (message: string, log = true) => {
	$.sync`git add -A`;

	$.sync`git commit -m "${message}"`;

	if (log) success('Commit With Message: ' + message);
};

export const pushCommits = () => {
	if (!getGeneriConfig().push) return;

	info(`Pushing...`);

	const target = $.sync`git branch --show`;

	$.sync`git push origin ${target?.stdout || 'main'}`;

	$.sync`git push --tags`;

	success('Success in Push!');
};

export const revertAll = () => {
	if (!isGit()) error('This command just rolls back changes in git.');

	isChangesForCommit(isGit());

	if (!verifyExistentRemote())
		error(
			'No remotes were found! Use git remote add origin <github|gitlab|gitbucket repository> instead.'
		);

	const tag = lastTag();

	$.sync`git reset HEAD~1`;

	$.sync`git tag --delete ${tag}`;

	$.sync`git checkout .`;

	success(`Success in revert ${tag} tag!`);
};

export const verifyExistentRemote = () => {
	try {
		$.sync`git remote -v`;
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
	const changes = $.sync`git diff HEAD`;

	return !changes.stdout;
};
