import { vice } from 'gradient-string';
import { isSilent } from './generi';
import { getPackage } from './utils';
import consola from 'consola';

export const getHeader = (command: string) => {
	if (isSilent()) return;

	const title = `Generi ${getPackage().version} | ${command}`;
	consola.log(vice(title));
	consola.log(vice('■'.repeat(title.length)));
	consola.log('\n');
};

export const success = (content: string) => {
	if (isSilent()) return;

	consola.success(vice(content));
};

export const error = (content: string) => {
	if (isSilent()) process.exit(1);

	consola.fatal(vice(content));

	process.exit(1);
};

export const warning = (content: string) => {
	if (isSilent()) return;

	consola.warn(vice(content));
};

export const info = (content: string) => {
	if (isSilent()) return;

	consola.info(vice(content));
};
