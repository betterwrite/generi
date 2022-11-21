import { nextTag } from '../src/git';
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
});
