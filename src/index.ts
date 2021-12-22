#!/usr/bin/env node

import sade from 'sade';

import { GitNewTag } from './types';

import * as init from './commands/init';
import * as log from './commands/log';

(async function () {
	const prog = sade('generi');

	prog
		.command('log <tag>')
		.describe('Generate Changelog')
		.example('log patch')
		.example('log minor')
		.example('log major')
		.action((tag: GitNewTag) => {
			log.setup(tag, { header: true });
		});

	prog
		.command('init')
		.describe('Start Changelog')
		.example('init')
		.action(() => {
			init.setup();
		});

	prog.parse(process.argv);
})();
