import { GeneriOptions } from './types';
import { getConfigRoot, setFile, getFile } from './utils';
import { success } from './console';
import { destr } from 'destr';

export const getGeneri = (): GeneriOptions => {
	return destr<GeneriOptions>(getFile(getConfigRoot()));
};

export const getGeneriConfig = () => config;
const config = getGeneri();

export const isSilent = () => config.silent;
export const isTag = () => config.tag;
export const isVersion = () => config.version;
export const isConventionalCommits = () => config.commits === 'conventional-commits';

export const setGeneriConfig = (generi: GeneriOptions) => {
	setFile(getConfigRoot(), generi);

	success('Generate <generi.json>');
};
