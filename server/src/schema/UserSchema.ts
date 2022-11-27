import type { Schema } from "express-validator";

export const RegisterUserSchema: Schema = {
  email: {
    in: "body",
    isEmail: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Password should be maximum 50 chars long",
    },
    errorMessage: "Email should exist",
  },
  username: {
    in: "body",
    isLength: {
      options: {
        min: 4,
        max: 50,
      },
      errorMessage: "Username should have minimum 4 chars and maximum 50 chars",
    },
    errorMessage: "Username should exist",
  },
  password: {
    in: "body",
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "password have minimum 8 chars",
    },
  },
  tokenversion: {
    not: true,
    exists: true,
    errorMessage: "tokenversion should not exist",
  },
};

export const LoginUserSchema: Schema = {
  email: {
    in: "body",
    isEmail: true,
    optional: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Password should be maximum 50 chars long",
    },
    errorMessage: "Email should exist",
  },
  username: {
    in: "body",
    isString: true,
    optional: true,
    isLength: {
      options: {
        min: 4,
        max: 50,
      },
      errorMessage: "Username should have minimum 4 chars and maximum 50 chars",
    },
    errorMessage: "Username should exist",
  },
  password: {
    in: "body",
    isString: true,
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "password have minimum 8 chars",
    },
  },
};
