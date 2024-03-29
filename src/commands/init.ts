import { getHeader, error } from '../console';
import { isGit, setVersion, setTag, initGit, setCommit } from '../git';
import { createChangelog } from '../changelog';
import { setGeneriConfig, getGeneriConfig } from '../generi';
import * as log from './log';
import generiDefault from '../defines/generi-default.json';
import { isChangesForCommit } from '../utils';

export const setup = () => {
	const git = isGit();

	getHeader('generi init');

	if (getGeneriConfig()) error('<generi.json> exists!');

	if (!git) initGit();

	isChangesForCommit(git);

	// @ts-expect-error
	setGeneriConfig(generiDefault);

	if (git) {
		setCommit('chore: generate generi.json');

		log.setup('patch', { header: true, git: { prerelease: undefined } });

		return;
	}

	setVersion('v0.1.0', 'minor');

	createChangelog('v0.1.0');

	setTag('v0.1.0');
};
