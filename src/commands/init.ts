import * as log from './log';
import { isGit, setVersion, setTag, initGit, setCommit, existsTag } from '../git';
import { createChangelog } from '../changelog';
import { getGeneri } from '../generi';
import { exists, getVersion, isChangesForCommit } from '../utils';

export const setup = () => {
	getGeneri().then(({ config, console }) => {
		const git = isGit();
		let version = getVersion(config);

		console.header('generi init');

		if (exists('./generi.json'))
			console.warning(
				'generi.json file is not supported in v2. New format in documentation.'
			);

		if (!exists('./generi.config.ts') || !exists('./generi.config.js'))
			console.warning('generi.config was not found, default config loaded.');

		if (!git) initGit(console);

		isChangesForCommit(git, console);

		if (!existsTag()) {
			if (version) setTag(version, console);
			else {
				version = 'v0.1.0';
				setVersion(version, { config, console }, 'patch');
			}
		}

		if (git) {
			setCommit('chore: generate generi.json', true, console);

			log.setup('patch', { header: true, git: { prerelease: undefined } });

			return;
		}

		if (!version) {
			console.error(`${config.packagePath} or ${config.lernaPath} it was not found.`);

			return;
		}

		setVersion(version, { config, console }, 'minor');

		createChangelog(version, { config, console });

		setTag(version, console);
	});
};
