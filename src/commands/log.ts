import { createChangelog } from '../changelog';
import { GitNewTag, LogOptions } from '../types';
import { lastTag, setVersion, setTag, newCommits, isValidTag, pushCommits } from '../git';
import { success, error, getHeader } from '../console';
import { existsConfig, getFile, getLernaRoot } from '../utils';
import { getGeneriConfig } from '../generi';
import { publish } from '../npm';
import { nextTag } from '../tag';
import { release } from '../release';

const validateLog = (tag: GitNewTag) => {
	const commits = newCommits();

	if (!existsConfig()) {
		error('Generi not exists! Use <generi init> command instead.');
		return false;
	}

	if (commits.length < 1) {
		error('There are no valid commits to create a new release.');
		return false;
	}

	if (!isValidTag(tag)) {
		error('Invalid Tag. Use patch|minor|major');
		return false;
	}

	return true;
};

export const setup = (tag: GitNewTag, options: LogOptions) => {
	const config = getGeneriConfig();

	if (!tag) {
		error('Insert valid git tag.');

		return;
	}

	if (options.header) getHeader(`generi log ${tag}`);

	if (!validateLog(tag)) return;

	const lerna = getFile(getLernaRoot());

	const last = lerna ? 'v' + JSON.parse(lerna).version : lastTag();

	const next = nextTag({
		last,
		tag,
		unreleased: tag.startsWith('pre')
			? options?.git?.prerelease ?? config.prerelease
			: undefined,
	});

	if (!next) {
		error('Unable to create a required tag!');
		return;
	}

	if (config.version) {
		success(`${last} to ${next} (${tag.toUpperCase()})`);

		setVersion(next, tag);
	}

	createChangelog(!config.version ? lastTag() : next);

	if (config.tag && (!options.init || !lerna)) setTag(next);

	pushCommits();

	if (config?.release) release(next, true);

	if (config?.publish) publish(next, lerna);
};
