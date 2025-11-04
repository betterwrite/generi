import consola from 'consola';
import { vice } from 'gradient-string';
import { GeneriConsole, GeneriOptions } from './types';
import pkg from '../package.json'

export const _console = (config: GeneriOptions): GeneriConsole => {
	const header = (command: string) => {
		if (config.silent) return;

		const title = `Generi ${pkg.version} | ${command}`;
		consola.log(vice(title));
		consola.log(vice('■'.repeat(title.length)));
		consola.log('\n');
	};

	const success = (content: string) => {
		if (config.silent) return;

		consola.success(vice(content));
	};

	const error = (content: string) => {
		if (config.silent) process.exit(1);

		consola.fatal(vice(content));

		process.exit(1);
	};

	const warning = (content: string) => {
		if (config.silent) return;

		consola.warn(vice(content));
	};

	const info = (content: string) => {
		if (config.silent) return;

		consola.info(vice(content));
	};

	return { header, success, error, warning, info };
};
