import execa from 'execa';
import fs from 'fs-extra';
import path from 'pathe';
import { isCleanChanges } from './git';
import { GeneriConsole, GeneriOptions, GitNewTag } from './types';
import { destr } from 'destr';
import { existsSync } from 'fs-extra';

export const getRoot = (): string => {
	// TODO: dynamic cwd
	return process.cwd();
};

export const getFileRoot = (p: string = 'generi.json') => {
	return path.join(getRoot(), p);
};

export const getRootPath = () => {
	return execa.sync('git', ['rev-parse', '--show-toplevel'], { cwd: getRoot() }).stdout;
};

export const getVersion = (config: GeneriOptions): string | undefined => {
	const pkgPath = path.resolve(process.cwd(), config.packagePath);
	const lernaPath = path.resolve(process.cwd(), config.lernaPath);

	const pkg = fs.existsSync(pkgPath)
		? destr<Record<string, any>>(fs.readFileSync(pkgPath))
		: {};

	if (pkg?.version) return `v${pkg.version}`;

	const lerna = fs.existsSync(lernaPath)
		? destr<Record<string, any>>(fs.readFileSync(lernaPath))
		: {};

	return lerna?.version ? `v${lerna.version}` : undefined;
};

export const getChangelogRoot = (name: string = 'CHANGELOG.md') => {
	return path.resolve(getRoot(), name);
};

export const existsChangelog = () => {
	return fs.existsSync(getChangelogRoot());
};

export const getFile = (path: string): any => {
	try {
		return fs.readFileSync(path).toString();
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

export const isChangesForCommit = (git: boolean, console: GeneriConsole) => {
	if (git && !isCleanChanges())
		console.error(
			'There are existing changes in project for commit. Commit first before using this command.'
		);
};

export const isPrerelease = (tag: GitNewTag) => tag.startsWith('pre');

export const exists = (file: string) => existsSync(path.join(getRoot(), file));
