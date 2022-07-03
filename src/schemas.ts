import { Schema } from './validator';

export const testSchema: Schema = {
  id: {
    type: 'number',
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  bool: {
    type: 'boolean',
    required: true,
  },
  obj: {
    type: 'object',
    required: true,
  },
  arr: {
    type: 'array',
    required: true,
  },
  optional: {
    type: 'string',
    required: false,
  },
  withRule: {
    type: 'boolean',
    required: true,
    rule: (value) => {
      return !!value;
    },
  },
};

export const userSchema: Schema = {
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
