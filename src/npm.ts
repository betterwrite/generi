import execa from 'execa';
import { getManager } from './monorepo';
import { lastTag } from './git';
import { GeneriConsole } from './types';

export const publish = (
	target: string,
	console: GeneriConsole,
	lerna?: boolean,
	tag: string = lastTag()
) => {
	console.info('Publishing...');

	if (lerna) {
		try {
			execa.sync('lerna', [
				'publish',
				"'from-package'",
				'--yes',
				'--no-push',
				'--force-publish',
			]);
		} catch (e) {
			console.error('Unable to publish the package in NPM with <lerna publish> command!');
		}
	} else {
		try {
			const { isPnpmWorkspace, tool } = getManager();

			isPnpmWorkspace && tool === 'pnpm'
				? execa.sync('pnpm', [
						'-r',
						'publish',
						'--access',
						'public',
						'--no-git-checks',
						'--tag',
						tag,
					])
				: execa.sync('npm', ['publish']);
		} catch (e) {
			console.error('Unable to publish the package in NPM!');
		}
	}

	console.success(`Version ${target} Has Been Published!`);
};
