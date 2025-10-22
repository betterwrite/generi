import { createChangelog } from '../changelog';
import { GitNewTag, LogOptions } from '../types';
import { lastTag, setVersion, setTag, newCommits, isValidTag, pushCommits } from '../git';
import { success, error, getHeader } from '../console';
import {
	existsConfig,
	getFile,
	getLernaRoot,
	getPackageRoot,
	isPrerelease,
} from '../utils';
import { getGeneriConfig } from '../generi';
import { publish } from '../npm';
import { nextTag } from '../tag';
import { release } from '../release';
import { destr } from 'destr';

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
		error('Invalid Tag. Use patch|prepatch|minor|preminor|major|premajor');
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
	const pkg = getFile(getPackageRoot());

	if (!lerna && !pkg) {
		error(
			'No configuration file was found. If you use a different path for <lerna.json> or <package.json>, look in the documentation on our github for the packagePath or lernaPath option.'
		);
	}

	let target = lerna ? lerna : pkg;

	const last = 'v' + destr<Record<string, any>>(target).version;

	const prerelease = isPrerelease(tag)
		? (options?.git?.prerelease ?? config.prerelease ?? 'beta')
		: undefined;

	const next = nextTag({
		last,
		tag,
		prerelease,
	});

	if (!next) {
		error('Unable to create a required tag!');
		return;
	}

	if (config.version) {
		success(`${last} to ${next} (${tag.toUpperCase()})`);

		setVersion(next, tag, prerelease);
	}

	createChangelog(!config.version ? lastTag() : next);

	if (config.tag && (!options.init || !lerna)) setTag(next);

	pushCommits();

	if (config?.release) release(next, true);

	if (config?.publish) publish(next, lerna);
};
