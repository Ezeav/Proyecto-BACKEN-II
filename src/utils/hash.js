import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};



