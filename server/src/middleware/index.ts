import { expressjwt } from "express-jwt";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import { MiddlewareFn } from "type-graphql";

import { PATH_WHITELIST, ACCESS_TOKEN } from "../constant";
import { parseToken } from "../function";
import { GraphQLContext } from "../interface";

export const expressJWTMiddleware = expressjwt({
  secret: ACCESS_TOKEN as string,
  algorithms: ["HS256"],
}).unless({
  path: PATH_WHITELIST,
});

export const morganMiddleware = morgan("combined", {
  stream: rfs.createStream("activity.log", {
    interval: "1d",
    path: "log",
  }),
});

export const graphqlAuth: MiddlewareFn<GraphQLContext> = (
  { context },
  next
) => {
  const authorization = context.req.headers.authorization;

  if (!authorization) {
    throw new Error("Not Authenticate");
  }

  try {
    const paylaod = parseToken(authorization);
    context.payload = paylaod as any;
  } catch (error) {
    console.log(error);
    throw new Error("Not Authenticate");
  }

  return next();
};
