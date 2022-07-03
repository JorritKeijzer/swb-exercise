import { validate, Schema } from './validator';

const userSchema: Schema = {
  id: {
    type: 'number',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'string',
    required: true,
    rule: (str: string) => {
      return !!str.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    },
  },
  username: {
    type: 'string',
    required: false,
  },
  password: {
    type: 'string',
    required: true,
    rule: (char: string) => {
      return char.length >= 6;
    },
  },
  followers: {
    type: 'array',
    required: false,
  },
  test: {
    type: 'object',
    required: false,
  },
};

const userData = {
  id: 1,
  name: 'test',
  email: 'test@test.qp',
  username: 'testingUsername',
  password: '123456',
  test: { name: 't' },
  followers: [{ name: 'follower' }],
};

validate(userSchema, userData);
