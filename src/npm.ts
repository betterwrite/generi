import execa from 'execa';
import { info, success, error } from './console';

export const publish = (target: string, lerna?: boolean) => {
	info('Publishing...');

	if (lerna) {
		try {
			execa.sync('lerna', ['publish', 'from-package', '--yes']);
		} catch (e) {
			error('Unable to publish the package in NPM!');
		}
	} else {
		try {
			execa.sync('npm', ['publish']);
		} catch (e) {
			error('Unable to publish the package in NPM!');
		}
	}

	success(`Version ${target} Has Been Published!`);
};
