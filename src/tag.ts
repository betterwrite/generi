import { warning } from './console';
import { GitNewTagOptions } from './types';
import { isPrerelease } from './utils';

export const nextTag = (options: GitNewTagOptions) => {
	let [major, minor, patch, prereleaseName, prereleaseValue]: (string | number)[] =
		options.last.replace('v', '').split(/[.-]/);

	major = Number(major) as number;
	minor = Number(minor) as number;
	patch = Number(patch) as number;

	if (
		isPrerelease(options.tag) &&
		prereleaseName &&
		prereleaseValue &&
		!options.last.includes(prereleaseName)
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

	const isSameFlow = !options?.prerelease && prereleaseName && prereleaseValue;

	if ((!prereleaseName || (prereleaseName && !options?.prerelease)) && !isSameFlow) {
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

	prereleaseValue = prereleaseValue ? 1 + (Number(prereleaseValue) as number) : 0;

	const isDifferentPreArgument = !prereleaseName?.includes(options?.prerelease ?? '');
	prereleaseValue = isDifferentPreArgument && prereleaseName ? 0 : prereleaseValue;

	return 'v' + raw + `-${options.prerelease}.` + prereleaseValue;
};
