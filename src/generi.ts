import { GeneriOptions } from './types';
import { getConfigRoot, setFile, getFile } from './utils';
import { success } from './console';

export const isSilent = () => getGeneriConfig().silent;
export const isTag = () => getGeneriConfig().tag;
export const isVersion = () => getGeneriConfig().version;
export const isConventionalCommits = () =>
	getGeneriConfig().commits === 'conventional-commits';

export const setGeneriConfig = (config: GeneriOptions) => {
	setFile(getConfigRoot(), config);

	success('Generate <generi.json>');
};

export const getGeneriConfig = (): GeneriOptions => {
	return JSON.parse(getFile(getConfigRoot()));
};
