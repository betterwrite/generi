import { nextTag } from '../src/tag';
import { describe, expect, it } from 'vitest';

describe('GIT', () => {
	// git next tag tests
	it('should next patch tag', () => {
		expect(
			nextTag({
				tag: 'patch',
				last: 'v0.1.0',
			})
		).toEqual('v0.1.1');
	});

	it('should next patch tag with two arguments', () => {
		expect(
			nextTag({
				tag: 'patch',
				last: 'v0.1.9',
			})
		).toEqual('v0.1.10');
	});

	it('should next patch tag with three arguments', () => {
		expect(
			nextTag({
				tag: 'patch',
				last: 'v0.1.99',
			})
		).toEqual('v0.1.100');
	});

	it('should next minor tag', () => {
		expect(
			nextTag({
				tag: 'minor',
				last: 'v0.1.0',
			})
		).toEqual('v0.2.0');
	});

	it('should next minor tag in existent patch', () => {
		expect(
			nextTag({
				tag: 'minor',
				last: 'v0.1.5',
			})
		).toEqual('v0.2.0');
	});

	it('should next minor tag with two arguments', () => {
		expect(
			nextTag({
				tag: 'minor',
				last: 'v1.9.5',
			})
		).toEqual('v1.10.0');
	});

	it('should next minor tag with three arguments', () => {
		expect(
			nextTag({
				tag: 'minor',
				last: 'v0.99.5',
			})
		).toEqual('v0.100.0');
	});

	it('should next major tag', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v0.1.0',
			})
		).toEqual('v1.0.0');
	});

	it('should next major tag in existent patch', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v0.0.5',
			})
		).toEqual('v1.0.0');
	});

	it('should next major tag in existent minor', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v0.5.0',
			})
		).toEqual('v1.0.0');
	});

	it('should next major tag in existent minor and patch', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v0.1.5',
			})
		).toEqual('v1.0.0');
	});

	it('should next major tag with two arguments', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v9.5.2',
			})
		).toEqual('v10.0.0');
	});

	it('should next major tag with three arguments', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v99.10.5',
			})
		).toEqual('v100.0.0');
	});

	it('should next patch tag with alpha argument', () => {
		expect(
			nextTag({
				tag: 'prepatch',
				last: 'v0.17.15',
				unreleased: 'alpha',
			})
		).toEqual('v0.17.16-alpha.0');
	});

	it('should next patch tag with alpha pre-argument', () => {
		expect(
			nextTag({
				tag: 'prepatch',
				last: 'v0.17.16-alpha.0',
				unreleased: 'alpha',
			})
		).toEqual('v0.17.16-alpha.1');
	});

	it('should next minor tag with alpha argument', () => {
		expect(
			nextTag({
				tag: 'preminor',
				last: 'v0.17.15',
				unreleased: 'alpha',
			})
		).toEqual('v0.18.0-alpha.0');
	});

	it('should next minor tag with alpha pre-argument', () => {
		expect(
			nextTag({
				tag: 'preminor',
				last: 'v0.18.0-alpha.0',
				unreleased: 'alpha',
			})
		).toEqual('v0.18.0-alpha.1');
	});

	it('should next major tag with alpha argument', () => {
		expect(
			nextTag({
				tag: 'premajor',
				last: 'v0.17.15',
				unreleased: 'alpha',
			})
		).toEqual('v1.0.0-alpha.0');
	});

	it('should next major tag with alpha pre-argument', () => {
		expect(
			nextTag({
				tag: 'premajor',
				last: 'v1.0.0-alpha.0',
				unreleased: 'alpha',
			})
		).toEqual('v1.0.0-alpha.1');
	});

	it('should next patch tag with beta argument', () => {
		expect(
			nextTag({
				tag: 'prepatch',
				last: 'v0.17.15',
				unreleased: 'beta',
			})
		).toEqual('v0.17.16-beta.0');
	});

	it('should next patch tag with beta pre-argument', () => {
		expect(
			nextTag({
				tag: 'prepatch',
				last: 'v0.17.16-beta.0',
				unreleased: 'beta',
			})
		).toEqual('v0.17.16-beta.1');
	});

	it('should next minor tag with beta argument', () => {
		expect(
			nextTag({
				tag: 'preminor',
				last: 'v0.17.15',
				unreleased: 'beta',
			})
		).toEqual('v0.18.0-beta.0');
	});

	it('should next minor tag with beta pre-argument', () => {
		expect(
			nextTag({
				tag: 'preminor',
				last: 'v0.18.0-beta.0',
				unreleased: 'beta',
			})
		).toEqual('v0.18.0-beta.1');
	});

	it('should next major tag with beta argument', () => {
		expect(
			nextTag({
				tag: 'premajor',
				last: 'v0.17.15',
				unreleased: 'beta',
			})
		).toEqual('v1.0.0-beta.0');
	});

	it('should next major tag with beta pre-argument', () => {
		expect(
			nextTag({
				tag: 'premajor',
				last: 'v1.0.0-beta.0',
				unreleased: 'beta',
			})
		).toEqual('v1.0.0-beta.1');
	});

	it('should next major tag with beta argument', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v1.0.0-beta.5',
			})
		).toEqual('v2.0.0');
	});

	it('should next major tag with alpha argument', () => {
		expect(
			nextTag({
				tag: 'major',
				last: 'v1.0.0-alpha.27',
			})
		).toEqual('v2.0.0');
	});

	it('should next tag with pre-alpha argument to beta-argument', () => {
		expect(
			nextTag({
				tag: 'premajor',
				last: 'v1.0.0-alpha.27',
				unreleased: 'beta',
			})
		).toEqual('v1.0.0-beta.0');
	});

	it('should next tag with pre-beta argument to alpha-argument', () => {
		expect(
			nextTag({
				tag: 'premajor',
				last: 'v1.0.0-beta.27',
				unreleased: 'alpha',
			})
		).toEqual('v1.0.0-alpha.0');
	});
});
