import { $ } from 'zx';
import { info, success, error } from './console';
import { getManager } from './monorepo';
import { lastTag } from './git';

export const publish = (target: string, lerna?: boolean, tag: string = lastTag()) => {
	info('Publishing...');

	if (lerna) {
		try {
			$.sync`lerna publish 'from-package' --yes --no-push --force-publish`;
		} catch (e) {
			error('Unable to publish the package in NPM with <lerna publish> command!');
		}
	} else {
		try {
			const { isPnpmWorkspace, tool } = getManager();

			isPnpmWorkspace && tool === 'pnpm'
				? $.sync`pnpm -r publish --access public --no-git-checks --tag ${tag}`
				: $.sync`npm publish`;
		} catch (e) {
			error('Unable to publish the package in NPM!');
		}
	}

	success(`Version ${target} Has Been Published!`);
};
