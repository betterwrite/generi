import { $ } from 'zx';
import { info, success, error } from './console';

export const publish = (target: string, lerna?: boolean) => {
	info('Publishing...');

	if (lerna) {
		try {
			$.sync`lerna publish 'from-package' --yes --no-push --force-publish`;
		} catch (e) {
			error('Unable to publish the package in NPM with <lerna publish> command!');
		}
	} else {
		try {
			$.sync`npm publish`;
		} catch (e) {
			error('Unable to publish the package in NPM!');
		}
	}

	success(`Version ${target} Has Been Published!`);
};
