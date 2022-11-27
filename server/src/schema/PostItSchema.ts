import type { Schema } from "express-validator";

export const GETPostItSchema: Schema = {
  page: {
    in: "query",
    isInt: true,
    errorMessage: "use Int for page query",
  },
  page_size: {
    in: "query",
    isInt: true,
    errorMessage: "use Int for page_size query",
  },
};

export const GETSpesificPostItSchema: Schema = {
  id: {
    in: "params",
    isUUID: true,
    errorMessage: "use UUID for id params",
  },
};

export const POSTPostItSchema: Schema = {
  head: {
    in: "body",
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "Head should have minimum 1 chars and maximum 255 chars",
    },
    errorMessage: "Head should exist",
  },
  body: {
    in: "body",
    optional: true,
    isString: true,
    errorMessage: "Body should be string",
  },
  status: {
    in: "body",
    isBoolean: {
      options: {
        strict: true,
      },
    },
    errorMessage: "Status should be Boolean",
  },
};

export const PUTPostItSchema: Schema = {
  id: {
    in: "params",
    isUUID: true,
    errorMessage: "use UUID params",
  },
  head: {
    in: "body",
    optional: true,
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "Head should have minimum 1 chars and maximum 255 chars",
    },
    errorMessage: "Head should exist",
  },
  body: {
    in: "body",
    optional: true,
    isString: true,
    errorMessage: "Body should be string",
  },
  status: {
    in: "body",
    optional: true,
    isBoolean: {
      options: {
        strict: true,
      },
    },
    errorMessage: "Status should be Boolean",
  },
};

export const DELETEPostItSchema: Schema = {
  id: {
    in: "params",
    isUUID: true,
    errorMessage: "use UUID params",
  },
};
