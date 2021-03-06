import {JWTWrapper} from '../../src/components/JWTWrapper';

describe('A JWTWrapper ', () => {
  const jwtWrapperMock = new JWTWrapper('secretkey');

  it('Should be able to sign a token', () => {
    const token = jwtWrapperMock.signToken({}, {});

    expect(token).toBeDefined();
  });

  it('Should throw error if no key provided', () => {
    const jwtWrapperMock = new JWTWrapper('');

    try {
      jwtWrapperMock.signToken({}, {});
    } catch (error) {
      expect(error).toBeDefined();
      return;
    }

    fail();
  });

  it('Can verify a token', () => {
    const jwt = jwtWrapperMock.verify(jwtWrapperMock.signToken({}, {
      noTimestamp: true,
    }));

    expect(jwt).toEqual({});
  });
});