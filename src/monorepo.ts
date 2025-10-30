import path from 'pathe';
import { getRoot } from './utils';
import { existsSync } from 'fs-extra';

export const getManager = (): {
	tool: 'pnpm' | 'yarn' | 'bun' | 'npm';
	isMonorepoWithTool: boolean;
	isPnpmWorkspace: boolean;
} => {
	const cwd = getRoot();

	const exists = (file: string) => existsSync(path.join(cwd, file));

	const tool = exists('./pnpm-lock.yaml')
		? 'pnpm'
		: exists('./yarn.lock')
			? 'yarn'
			: exists('./bun.lock')
				? 'bun'
				: 'npm';

	const isMonorepoWithTool = exists('./lerna.json') || exists('./nx.json');
	const isPnpmWorkspace = exists('pnpm-workspace.yaml');

	return { tool, isMonorepoWithTool, isPnpmWorkspace };
};
