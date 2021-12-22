import { success, error } from './console';
import { Commit, GitNewTagOptions, GitNewTag } from './types';
import { getRoot, setFile, getFile, getPackageRoot, getLernaRoot } from './utils';
import fs from 'fs';
import path from 'path';
import execa from 'execa';

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
		.map(parseLogMessage)
};

export const lastTag = (): string => {
	let last;

	try {
		last = execa.sync('git', ['describe', '--abbrev=0', '--tags']);
	} catch (e) {}

	if (last?.failed || !last) {
		error('Unable to fetch the last tag. First use the generi init command');
	}

	return (last as any).stdout;
};

export const nextTag = (options: GitNewTagOptions) => {
	const resetPatch = (str: string) => {
		return str.slice(0, -1) + 0;
	};

	const resetMinor = (str: string) => {
		let r = '';

		r = str.slice(0, 3) + str.slice(4);

		r = r.slice(0, 3) + 0 + r.slice(3);

		return r;
	};

	let t = '';

	if (options.tag === 'patch') {
		const patch = Number(options.last.charAt(options.last.length - 1));

		t = options.last.slice(0, -1) + (patch + 1);

		return t;
	}

	if (options.tag === 'minor') {
		const minor = Number(options.last.charAt(3)) + 1;

		t = options.last.slice(0, 3) + options.last.slice(4);

		t = t.slice(0, 3) + minor + t.slice(3);

		t = resetPatch(t);

		return t;
	}

	if (options.tag === 'major') {
		const major = Number(options.last.charAt(1)) + 1;

		t = options.last.slice(0, 1) + options.last.slice(2);

		t = t.slice(0, 1) + major + t.slice(1);

		t = resetMinor(t);
		t = resetPatch(t);

		return t;
	}
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
  return commit.refName.filter((ref) => ref.includes('tag'))[0].replace('tag: ', '')
}

export const setVersion = (target: string) => {
	let lerna = getFile(getLernaRoot());

	// monorepo with lerna
	if (lerna) {
		!lerna.version
			? (lerna = {
					version: target,
					...lerna,
			  })
			: (lerna.version = target);

		setFile('lerna.json', lerna);

		success('Set ' + target + ' Version In <lerna.json>');
	} else {
		let pkg = getFile(getPackageRoot());

		if (!pkg) {
			error('<package.json> not exists!');
			return;
		}

		pkg = JSON.parse(pkg);

		const normalize = target.substring(1);

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
	const tags = execa.sync('git', ['tag', '-n']);

	if (tags.stdout?.includes(target)) {
		error('Tag already exists!');
		return;
	}

	const tag = execa.sync('git', ['tag', target]);

	if (tag.failed) {
		error('Tag already exists!');
		return;
	}

	success(target + ' Git Tag');
};

export const initGit = () => {
	const init = execa.sync('git', ['init']);

	if (init.failed) {
		error('Git is not installed.');
		return;
	}

	success('Initialized Git Project');

	execa.sync('git', ['add', '-A']);

	success('Added All Staged Changes');

	execa.sync('git', ['commit', '-m', 'chore(changelog): initial content']);

	success('Commit Initial Content With Message: chore(changelog): initial content');
};

export const setCommit = (message: string, log = true) => {
	execa.sync('git', ['add', '-A']);

	execa.sync('git', ['commit', '-m', message]);

	if (log) success('Commit With Message: ' + message);
};

export const isValidTag = (tag: GitNewTag) => {
	return tag === 'patch' || tag === 'minor' || tag === 'major';
};

export const isCleanChanges = (): boolean => {
	const changes = execa.sync('git', ['diff', 'HEAD']);

	return !changes.stdout;
};
