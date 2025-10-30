import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
    index: 'src/index.ts',
    'runner/index': 'src/runner/index.ts',
  },
	target: ['node18'],
  minify: true,
	clean: true,
	dts: true
});