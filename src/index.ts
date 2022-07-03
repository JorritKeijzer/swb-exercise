import { validate } from './validator';
import { userSchema } from './schemas';

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
