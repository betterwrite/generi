import yaml from 'js-yaml';
import { exists } from './utils';
import path from 'pathe';
import { readFileSync } from 'fs-extra';
import { Maybe } from './types';

export const getManager = (): {
	tool: 'pnpm' | 'yarn' | 'bun' | 'npm';
	isMonorepoWithTool: boolean;
	isPnpmWorkspace: boolean;
} => {
	const tool = exists('./pnpm-lock.yaml')
		? 'pnpm'
		: exists('./yarn.lock')
			? 'yarn'
			: exists('./bun.lock')
				? 'bun'
				: 'npm';

	const isMonorepoWithTool = exists('./lerna.json') || exists('./nx.json');
	const isPnpmWorkspace = exists('./pnpm-workspace.yaml');

	return { tool, isMonorepoWithTool, isPnpmWorkspace };
};

// TODO: deep type pnpm-workspace for edge cases use
export const getPNPMWorkspace = (): Maybe<Record<'packages', string[]>> => {
	return getManager().isPnpmWorkspace
		? (yaml.load(
				readFileSync(path.resolve(process.cwd(), './pnpm-workspace.yaml'), 'utf8')
			) as Record<'packages', string[]>)
		: undefined;
};
