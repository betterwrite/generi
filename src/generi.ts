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

	const csl = _console(config);

	try {
		if (
			config.repository &&
			(config.repository === 'force' || config.repository === 'ignore')
		) {
			const remote = config.repository === 'ignore' ? 'ignore' : getRemoteOrigin();

			config.repository = remote || 'ignore';

			if (!remote) {
				csl.warning(
					`config.repository force source could not be found. 'repository' will be ignored.`
				);
			}
		}
	} catch (e) {
		// TODO: target others repo url
	}

	return { config, console: csl };
};
