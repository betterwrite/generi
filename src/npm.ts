import execa from 'execa';
import { info, success, error } from './console';
import { getGeneriConfig } from './generi';

export const publish = (target: string) => {
	if (!getGeneriConfig().publish) return;

	info('Publishing...');

	try {
		execa.sync('npm', ['publish', '--access', 'public', '--tag', target]);
	} catch (e) {
		error('Unable to publish the package in NPM!');
	}

	success(`Version ${target} Has Been Published!`);
};
