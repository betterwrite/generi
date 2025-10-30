import { $ } from 'zx';
import { error, success, warning } from './console';

export const release = (tag: string, autoNotes: boolean = true) => {
	try {
		$.sync`gh`;
	} catch (e) {
		error('Github CLI https://cli.github.com/ <gh> was not found in this system.');

		return;
	}

	try {
		const repo = $.sync`git remote -v`;

		if (!repo.stdout?.includes('https://github.com'))
			throw Error('generi release supports only github repositories');
	} catch (e) {
		warning('generi release supports only github repositories. Ignoring this step.');

		return;
	}

	const prerelease = tag.match(/(alpha|beta|canary)/g) ? ['--prerelease'] : [];
	const generateNotes = autoNotes ? ['--generate-notes'] : [];

	try {
		$.sync`gh release create ${tag} --title ${tag} ${prerelease.join('')} --verify-tag ${generateNotes.join('')}`;
	} catch (e) {
		warning('Unable to release this version!');

		return;
	}

	success(`Version ${tag} Has Been Released!`);
};
