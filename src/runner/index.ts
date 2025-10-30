import type { Awaitable, GitLogOptions, GitNewTag } from '../types';

import * as _log from '../commands/log';
import * as _init from '../commands/init';
import * as _revert from '../commands/revert';

export const log = (tag: GitNewTag, git: GitLogOptions = {}): Awaitable<void> => {
	return new Promise(async (res, rej) => {
		try {
			await _log.setup(tag, { header: true, git });

			res();
		} catch (e) {
			rej(e);
		}
	});
};

export const init = (): Awaitable<void> => {
	return new Promise(async (res, rej) => {
		try {
			await _init.setup();

			res();
		} catch (e) {
			rej(e);
		}
	});
};

export const revert = (): Awaitable<void> => {
	return new Promise(async (res, rej) => {
		try {
			await _revert.setup();

			res();
		} catch (e) {
			rej(e);
		}
	});
};

export * from '../types';
