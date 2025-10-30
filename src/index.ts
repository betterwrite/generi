#!/usr/bin/env -vS zx

import sade from 'sade';

import type { GitLogOptions, GitNewTag } from './types';

import * as init from './commands/init';
import * as log from './commands/log';
import * as revert from './commands/revert';
import * as test from './commands/test';

(async function () {
	const prog = sade('generi');

	prog
		.command('log <tag>', 'Generate Changelog', {
			alias: ['l', 'olg'],
		})
		.example('log patch')
		.example('log minor')
		.example('log major')
		.example('log major -u beta')
		.option('-p, --prerelease', 'Pre-release with canary, alpha or beta argument')
		.action((tag: GitNewTag, git: GitLogOptions) => {
			log.setup(tag, { header: true, git });
		});

	prog
		.command('init', 'Start Changelog', {
			alias: ['i', 'inti'],
		})
		.example('init')
		.action(() => {
			init.setup();
		});

	prog
		.command('revert', 'Revert <generi log> Command', {
			alias: ['r', 'rev', 'revetr'],
		})
		.example('revert')
		.action(() => {
			revert.setup();
		});

	prog
		.command('test', 'A some test', {
			alias: ['tests'],
		})
		.example('test')
		.action(() => {
			test.setup();
		});

	prog.parse(process.argv);
})();
