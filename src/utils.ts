import fs from 'fs-extra';
import execa from 'execa';
import path from 'pathe';
import { error } from './console';
import { isCleanChanges } from './git';
import { GitNewTag } from './types';
import { destr } from 'destr';
import { lernaConfig, pkgConfig } from './generi';

export const getRoot = (): string => {
	return process.cwd();
};

export const getPackageRoot = (p: string = pkgConfig) => {
	return path.join(getRoot(), p);
};

export const getLernaRoot = (p: string = lernaConfig) => {
	return path.join(getRoot(), p);
};

export const getConfigRoot = (p: string = 'generi.json') => {
	return path.join(getRoot(), p);
};

export const getRootPath = () => {
	return execa.sync('git', ['rev-parse', '--show-toplevel'], { cwd: getRoot() }).stdout;
};

export const getVersion = (): string | undefined => {
	const pkgPath = getPackageRoot();
	const lernaPath = getLernaRoot();

	const pkg = fs.existsSync(pkgPath)
		? destr<Record<string, any>>(fs.readFileSync(pkgPath) as any)
		: {};
	const lerna = fs.existsSync(lernaPath)
		? destr<Record<string, any>>(fs.readFileSync(lernaPath) as any)
		: {};

	return pkg.version
		? `v${pkg.version}`
		: lerna.version
			? `v${lerna.version}`
			: undefined;
};

export const getChangelogRoot = (name: string = 'CHANGELOG.md') => {
	return path.resolve(getRoot(), name);
};

export const existsChangelog = () => {
	return fs.existsSync(getChangelogRoot());
};

export const existsConfig = () => {
	return fs.existsSync(getConfigRoot());
};

export const getFile = (path: string): any => {
	try {
		return fs.readFileSync(path);
	} catch (e) {
		return false;
	}
};

export const setFile = (path: string, content: any) => {
	fs.writeFileSync(path, JSON.stringify(content, null, 2));
};

export const setChangelog = (content: string) => {
	fs.writeFileSync(getChangelogRoot(), content, { encoding: 'utf-8' });
};

export const getPackage = () => {
	return destr(getFile(getPackageRoot()));
};

export const isChangesForCommit = (git: boolean) => {
	if (git && !isCleanChanges())
		error(
			'There are existing changes in project for commit. Commit first before using this command.'
		);
};

export const isPrerelease = (tag: GitNewTag) => tag.startsWith('pre');
