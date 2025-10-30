import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
    index: 'src/index.ts',
    code: 'src/code/index.ts',
  },
	target: ['node18'],
  minify: true,
	clean: true,
	dts: true
});