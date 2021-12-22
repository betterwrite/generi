import { nextTag } from '../src/git';

describe('GIT', () => {
  // git next tag tests
  it('should next patch tag', () => {
    expect(nextTag({
      tag: 'patch',
      last: 'v0.1.0'
    })).toEqual('v0.1.1');
  });

  it('should next minor tag', () => {
    expect(nextTag({
      tag: 'minor',
      last: 'v0.1.0'
    })).toEqual('v0.2.0');
  });

  it('should next minor tag in existent patch', () => {
    expect(nextTag({
      tag: 'minor',
      last: 'v0.1.5'
    })).toEqual('v0.2.0');
  });

  it('should next major tag', () => {
    expect(nextTag({
      tag: 'major',
      last: 'v0.1.0'
    })).toEqual('v1.0.0');
  });

  it('should next major tag in existent patch', () => {
    expect(nextTag({
      tag: 'major',
      last: 'v0.0.5'
    })).toEqual('v1.0.0');
  });

  it('should next major tag in existent minor', () => {
    expect(nextTag({
      tag: 'major',
      last: 'v0.5.0'
    })).toEqual('v1.0.0');
  });

  it('should next major tag in existent minor and patch', () => {
    expect(nextTag({
      tag: 'major',
      last: 'v0.1.5'
    })).toEqual('v1.0.0');
  });
})