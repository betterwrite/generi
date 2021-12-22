import execa from 'execa';
import { info, success, error } from './console';

export const publish = (target: string) => {
	info('Publishing...');

	try {
		execa.sync('npm', ['publish', '--access', 'public', '--tag', target]);
	} catch (e) {
		error('Unable to publish the package in NPM!');
	}

	success(`Version ${target} Has Been Published!`);
};
