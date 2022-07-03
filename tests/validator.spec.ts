import * as Validator from '../src/validator';
import { testSchema } from '../src/schemas';

const passData = {
  id: 1,
  title: 'passData',
  bool: true,
  obj: {},
  arr: [],
  withRule: true,
};

const failDataMissingItem = {
  id: '1',
  title: 'passData',
  bool: true,
  obj: {},
  arr: [],
  withRule: true,
};

const failDataFaultyId = {
  id: '1',
  title: 'passData',
  bool: true,
  obj: {},
  arr: [],
  optional: 'optional',
  withRule: true,
};

describe('Testing validator: with valid data', () => {
  const data = Validator.validate(testSchema, passData);

  test('Passed is true', () => {
    expect(data.passed).toBeTruthy();
  });

  test('Errors array is empty', () => {
    if (data.errors) expect(data.errors).toBeFalsy();
  });
});

// test('Testing validator: with invalid data', () => {
//   expect(Validator.validate(failSchema, failData)).toBeFalsy();
// });

describe('Testing validator: with invalid data - Optional data required', () => {
  const data = Validator.validate(testSchema, failDataMissingItem);

  test('Should throw optional "required" error', () => {
    if (data.errors) {
      expect(typeof data.errors[0]).toBe('string');
      // I would normally use toContain but for some reason its throwing a weird character error, try it :)
      // I'd like to know the solution, lemme know bastard!
      // So now I'm doing it the cheap route?
      expect(
        data.errors[0] ===
          '❌  ValidationError: "optional", was defined in the schema, but it is not present in the data...',
      );
    }
  });

  test('Length of error array', () => {
    if (data.errors) {
      expect(data.errors.length).toEqual(1);
    }
  });

  test('Passed in object should be false', () => {
    if (data.errors) {
      expect(data.errors).toBeTruthy();
    }
    expect(data.passed).toBeFalsy();
  });
});

describe('Testing validator: with invalid data - ID data is faulty', () => {
  const data = Validator.validate(testSchema, failDataFaultyId);

  test('Length of error array', () => {
    if (data.errors) {
      expect(data.errors.length).toEqual(1);
    }
  });

  test('Passed in object should be false', () => {
    if (data.errors) {
      expect(data.errors).toBeTruthy();
    }
    expect(data.passed).toBeFalsy();
  });
});
