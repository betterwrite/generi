import { createChangelog } from '../changelog';
import { GitNewTag, LogOptions } from '../types';
import { nextTag, lastTag, setVersion, setTag, newCommits, isValidTag } from '../git';
import { success, error, getHeader } from '../console';
import { isChangesForCommit, existsConfig } from '../utils';
import { getGeneriConfig } from '../generi';
import { isGit } from '../git';

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

	if (options.header) getHeader(`generi log ${tag}`);

	isChangesForCommit(isGit());

	if (!validateLog(tag)) return;

	const next = nextTag({
		last: lastTag(),
		tag,
	});

	if (!next) {
		error('Unable to create a required tag!');
		return;
	}

	if (config.version) {
		success(`${lastTag()} to ${next} (${tag.toUpperCase()})`);

		setVersion(`${next}`);
	}

	createChangelog(!config.version || config.monorepo ? lastTag() : next);

	if (config.tag) setTag(next);
};
