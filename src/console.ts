import gradient from 'gradient-string';
import { isSilent } from './generi';

export const getHeader = (command: string) => {
	if (isSilent()) return;

	const title = `Generi - A CHANGELOG.md Generator | ${command}`;
	console.log(gradient.vice(title));
	console.log(gradient.vice('■'.repeat(title.length)));
	console.log('\n');
};

export const success = (content: string) => {
	if (isSilent()) return;

	console.log(gradient.vice('- ✅  ' + content));
};

export const error = (content: string) => {
	if (isSilent()) process.exit(1);

	console.log(gradient.vice('- ❌  ' + content));

	process.exit(1);
};

export const warning = (content: string) => {
	if (isSilent()) return;

	console.log(gradient.vice('- ✋  ' + content));
};

export const info = (content: string) => {
	if (isSilent()) return;

	console.log(gradient.vice('- 🚨  ' + content));
};
