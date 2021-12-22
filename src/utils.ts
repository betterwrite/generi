import fs from 'fs';
import execa from 'execa';
import path from 'path';
import { error } from './console';
import { isCleanChanges } from './git';

export const getRoot = () => {
	return process.cwd();
};

export const getPackageRoot = (p: string = 'package.json') => {
	return path.join(getRoot(), p);
};

export const getLernaRoot = (p: string = 'lerna.json') => {
	return path.join(getRoot(), p);
};

export const getConfigRoot = (p: string = 'generi.json') => {
	return path.join(getRoot(), p);
};

export const getDefaultGeneriConfig = (p: string = 'src/defines/generi-default.json') => {
	return path.join(getRoot(), p);
};

export const getRootPath = () => {
	return execa.sync('git', ['rev-parse', '--show-toplevel'], { cwd: getRoot() }).stdout;
};

export const getVersion = (rootPath: string): string | undefined => {
	const pkgPath = path.join(rootPath, 'package.json');
	const lernaPath = path.join(rootPath, 'lerna.json');

	const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath) as any) : {};
	const lerna = fs.existsSync(lernaPath)
		? JSON.parse(fs.readFileSync(lernaPath) as any)
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

export const existsGeneri = () => {
	return fs.existsSync(getDefaultGeneriConfig());
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
	return JSON.parse(getFile(getPackageRoot()));
};

export const isChangesForCommit = (git: boolean) => {
	if (git && !isCleanChanges())
		error(
			'There are existing changes in project for commit. Commit first before using this command.'
		);
};
