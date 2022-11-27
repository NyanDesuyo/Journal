import jwt from "jsonwebtoken";
import { Response } from "express";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant";

export function parseToken(token: string): any {
  const parse = token.replace("Bearer ", "");

  return jwt.verify(parse, ACCESS_TOKEN as string);
}

export function payloadToken(token: string): any {
  const parse = token.replace("Bearer ", "");

  return jwt.verify(parse, REFRESH_TOKEN as string);
}

export function accessToken(data: object) {
  return jwt.sign(data, ACCESS_TOKEN as string, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
}

export function refreshToken(data: object) {
  return jwt.sign(data, REFRESH_TOKEN as string, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

export function setCookie(res: Response, token: string) {
  res.cookie("cukkie", token, {
    expires: new Date(Number(new Date()) + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
}
