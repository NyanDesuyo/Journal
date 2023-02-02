import * as dotenv from "dotenv";

dotenv.config();

export const SERVER_PORT = process.env.PORT;

export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const DEFAULT_TAKE_VALUE = 10;

export const PATH_WHITELIST: string[] = [
  "/status",
  "/v1/auth/refresh-token",
  "/v1/auth/revoke-refresh-token",
  "/v1/auth/register",
  "/v1/auth/login",
  "/graphql",
  "/",
];
