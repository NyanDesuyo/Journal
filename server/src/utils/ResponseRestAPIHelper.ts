import { ResponseRestAPI } from "../interface";

export function serverError(info: any): ResponseRestAPI {
  return {
    statuscode: 500,
    payload: {
      message: "Something went Wrong",
      info,
    },
  };
}

export function validationError(info: any): ResponseRestAPI {
  return {
    statuscode: 400,
    payload: {
      message: "Check your Request",
      info,
    },
  };
}
