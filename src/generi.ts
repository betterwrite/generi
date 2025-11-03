import { loadConfig } from 'c12';
import { getRemoteOrigin } from './git';
import defaultConfig from './defines/generi-default.json';
import { _console } from './console';

export const getGeneri = async () => {
	const { config } = await loadConfig({
		name: 'generi',
		rcFile: false,
		envName: false,
		defaultConfig,
	});

	try {
		if (!config.repository) config.repository = getRemoteOrigin() || 'https:';
	} catch (e) {
		// TODO: target others repo url
	}

	return { config, console: _console(config) };
};
