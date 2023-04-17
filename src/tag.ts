import { warning } from './console';
import { GitNewTagOptions } from './types';

export const nextTag = (options: GitNewTagOptions) => {
	let [major, minor, patch, alphaOrBeta, alphaOrBetaValue]: (string | number)[] =
		options.last.replace('v', '').split(/[.-]/);

	major = Number(major) as number;
	minor = Number(minor) as number;
	patch = Number(patch) as number;

	if (
		options.tag.startsWith('pre') &&
		alphaOrBeta &&
		alphaOrBetaValue &&
		!options.last.includes(alphaOrBeta)
	) {
		warning(
			'You are executing a pre(patch|minor|major) command of the same category. This approach is not recommended and may have an unexpected result.'
		);
	}

	const resetPatch = () => {
		patch = 0;
	};

	const resetMinor = () => {
		patch = 0;
		minor = 0;
	};

	const isSameFlow = !options?.prerelease && alphaOrBeta && alphaOrBetaValue;

	if ((!alphaOrBeta || (alphaOrBeta && !options?.prerelease)) && !isSameFlow) {
		if (options.tag.includes('patch')) {
			patch++;
		}

		if (options.tag.includes('minor')) {
			minor++;
			resetPatch();
		}

		if (options.tag.includes('major')) {
			major++;
			resetMinor();
			resetPatch();
		}
	}

	const raw = major + '.' + minor + '.' + patch;

	if (!options?.prerelease) return 'v' + raw;

	alphaOrBetaValue = alphaOrBetaValue ? 1 + (Number(alphaOrBetaValue) as number) : 1;

	const isDifferentPreArgument = !alphaOrBeta?.includes(options?.prerelease ?? '');
	alphaOrBetaValue = isDifferentPreArgument && alphaOrBeta ? 1 : alphaOrBetaValue;

	return 'v' + raw + `-${options.prerelease}.` + alphaOrBetaValue;
};
