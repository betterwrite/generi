import { createChangelog } from '../changelog';
import type { GeneriConsole, GitNewTag, GitPrerelease, LogOptions } from '../types';
import { lastTag, setVersion, setTag, newCommits, isValidTag, pushCommits } from '../git';
import { exists, getFile, getFileRoot, isPrerelease } from '../utils';
import { getGeneri } from '../generi';
import { publish } from '../npm';
import { nextTag } from '../tag';
import { release } from '../release';
import { destr } from 'destr';

const validateLog = (tag: GitNewTag, console: GeneriConsole) => {
	const commits = newCommits();

	if (commits.length < 1) {
		console.error('There are no valid commits to create a new release.');
	}

	if (!isValidTag(tag)) {
		console.error('Invalid Tag. Use patch|prepatch|minor|preminor|major|premajor');
	}

	return true;
};

export const setup = (tag: GitNewTag, options: LogOptions) => {
	getGeneri().then(async ({ config, console }) => {
		if (!tag) {
			console.error('Insert valid git tag.');

			return;
		}

		if (options.header) console.header(`generi log ${tag}`);

		if (!validateLog(tag, console)) return;

		if (exists('./generi.json'))
			console.warning(
				'generi.json file is not supported in v2. New format in documentation.'
			);

		if (!exists('./generi.config.ts') && !exists('./generi.config.js'))
			console.warning('generi.config was not found, default config loaded.');

		const lerna = getFile(getFileRoot(config.lernaPath));
		const pkg = getFile(getFileRoot(config.packagePath));

		if (!lerna && !pkg) {
			console.error(
				'No configuration file was found. If you use a different path for <lerna.json> or <package.json>, look in the documentation on our github for the packagePath or lernaPath option.'
			);
		}

		let target = lerna ? lerna : pkg;

		const version = destr<Record<string, any>>(target)?.version;
		if (!version) console.error('version in lerna.json or package.json not found!');
		const last = 'v' + version;

		const prerelease = isPrerelease(tag)
			? ((options?.git?.prerelease ?? config.prerelease ?? 'beta') as GitPrerelease)
			: undefined;

		const next = nextTag(
			{
				last,
				tag,
				prerelease,
			},
			console
		);

		if (!next) {
			console.error('Unable to create a required tag!');
			return;
		}

		if (config.version) {
			console.success(`${last} to ${next} (${tag.toUpperCase()})`);

			await setVersion(next, { console, config }, tag, prerelease);
		}

		createChangelog(!config.version ? lastTag() : next, { config, console });

		if (config.tag && (!options.init || !lerna)) setTag(next, console);

		pushCommits({ config, console });

		if (config?.release) release(next, true, console);

		if (config?.publish) publish(next, console, lerna, next);
	});
};
