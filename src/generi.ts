import { GeneriOptions } from './types';
import { getConfigRoot, setFile, getFile } from './utils';
import { success } from './console';
import { destr } from 'destr';

export const getGeneri = (): GeneriOptions => {
	return destr<GeneriOptions>(getFile(getConfigRoot()));
};

const config = getGeneri();
export const getGeneriConfig = () => config;

export const isSilent = () => config.silent;
export const isTag = () => config.tag;
export const isVersion = () => config.version;
export const isConventionalCommits = () => config.commits === 'conventional-commits';

export const pkgConfig = config?.packagePath || 'package.json';
export const lernaConfig = config?.lernaPath || 'lerna.json';

export const setGeneriConfig = (generi: GeneriOptions) => {
	setFile(getConfigRoot(), generi);

	success('Generate <generi.json>');
};
