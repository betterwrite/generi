import gradient from 'gradient-string';
import { isSilent } from './generi';
import consola from 'consola';
import pkg from '../package.json';

export const getHeader = (command: string) => {
	if (isSilent()) return;

	const title = `Generi ${pkg.version} | ${command}`;
	consola.log(gradient.vice(title));
	consola.log(gradient.vice('■'.repeat(title.length)));
	consola.log('\n');
};

export const success = (content: string) => {
	if (isSilent()) return;

	consola.success(gradient.vice(content));
};

export const error = (content: string) => {
	if (isSilent()) process.exit(1);

	consola.fatal(gradient.vice(content));

	process.exit(1);
};

export const warning = (content: string) => {
	if (isSilent()) return;

	consola.warn(gradient.vice(content));
};

export const info = (content: string) => {
	if (isSilent()) return;

	consola.info(gradient.vice(content));
};
