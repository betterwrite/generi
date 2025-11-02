import { getHeader, error } from '../console';
import { isGit, setVersion, setTag, initGit, setCommit, existsTag } from '../git';
import { createChangelog } from '../changelog';
import { setGeneriConfig, getGeneriConfig, pkgConfig, lernaConfig } from '../generi';
import * as log from './log';
import generiDefault from '../defines/generi-default.json';
import { getVersion, isChangesForCommit } from '../utils';

export const setup = () => {
	const git = isGit();
	let version = getVersion();

	getHeader('generi init');

	if (getGeneriConfig()) error('<generi.json> exists!');

	if (!git) initGit();

	isChangesForCommit(git);

	// @ts-expect-error
	setGeneriConfig(generiDefault);

	if (!existsTag()) {
		if (version) setTag(version);
		else {
			version = 'v0.1.0';
			setVersion(version, 'patch');
		}
	}

	if (git) {
		setCommit('chore: generate generi.json');

		log.setup('patch', { header: true, git: { prerelease: undefined } });

		return;
	}

	if (!version) {
		error(`${pkgConfig} or ${lernaConfig} it was not found.`);

		return;
	}

	setVersion(version, 'minor');

	createChangelog(version);

	setTag(version);
};
