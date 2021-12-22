#!/usr/bin/env node

import sade from 'sade';

import { GitNewTag } from './types';

import * as init from './commands/init';
import * as log from './commands/log';
import * as revert from './commands/revert';

(async function () {
	const prog = sade('generi');

	prog
		.command('log <tag>', 'Generate Changelog', {
			alias: ['l', 'olg'],
		})
		.example('log patch')
		.example('log minor')
		.example('log major')
		.action((tag: GitNewTag) => {
			log.setup(tag, { header: true });
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

	prog.parse(process.argv);
})();
