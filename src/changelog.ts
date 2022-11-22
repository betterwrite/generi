import { success } from './console';
import { commits, isTagCommit, setCommit, getTagCommit } from './git';
import { Commit, GeneriEmoticon } from './types';
import { setChangelog } from './utils';
import { getGeneriConfig } from './generi';
import conventional from './defines/conventional-commits.json';

const getEmoji = (str: string): string => {
	const emojis: GeneriEmoticon[] = [
		['feat', '🎉 '],
		['fix', '🔧 '],
		['build', '📐 '],
		['chore', '🚧 '],
		['ci', '🗿 '],
		['style', '🎨 '],
		['refactor', '🚩 '],
		['perf', '📈 '],
		['docs', '📝 '],
		['test', '🔧 '],
	];

	const target = emojis.find(([key]) => str.includes(key));

	return target ? target[1] : '  ';
};

const getChangelogHeader = () => {
	return `# Changelog (${new Date().toLocaleDateString()})\n\nChangelog was created by [Generi](https://github.com/Novout/generi). Any questions, consult the documentation.\n`;
};

const setSubHeader = (commit: Commit) => {
	const v = isTagCommit(commit)
		? getTagCommit(commit)
		: commit.summary.replace(/'/gi, '');

	return '\n### ' + v + '\n\n';
};

const setBasic = (commit: Commit) => {
	const generi = getGeneriConfig();
	let result: any;

	if (generi.commits === 'conventional-commits') {
		result = commit.summary
			.split(/:(.+)/)
			.filter((part) => part)
			.map((part) => part.trimStart());
	} else {
		result = commit.summary;
	}

	/*
	const type =
		parts[0].match(/(feat|fix|build|chore|ci|docs|style|refactor|perf|test)((.+))/) || [];
  */

	if (generi.commits === 'conventional-commits') {
		if (!result[0] || !result[1]) return '';

		return (
			'* **' +
			getEmoji(result[0]) +
			result[0].trim() +
			':** ' +
			result[1].trim() +
			` [${commit.sha}]` +
			'\n'
		);
	}

	if (isTagCommit(commit)) return '';

	return '* ' + result.trim() + ` [${commit.sha}]` + '\n';
};

const isConventionalCommit = (commit: Commit) => {
	return conventional.type.find((type) => commit.summary.includes(type));
};

export const setActuallyTag = (tag: string) => {
	return setSubHeader({
		summary: tag,
		sha: '__DEFAULT__',
		refName: [],
		date: '__DEFAULT__',
	});
};

export const createChangelog = (tag: string) => {
	const config = getGeneriConfig();
	let changelog = getChangelogHeader();

	if (config.tag) changelog += setActuallyTag(tag);

	commits().forEach((commit) => {
		if (isTagCommit(commit)) {
			changelog += setSubHeader(commit);
			return;
		}
		if (
			!isConventionalCommit(commit) &&
			getGeneriConfig().commits === 'conventional-commits'
		)
			return;

		changelog += setBasic(commit);
	});

	setChangelog(changelog);

	setCommit(config.tag ? tag : 'chore(generi): generate changelog.md');

	success('Generate CHANGELOG.md');
};
