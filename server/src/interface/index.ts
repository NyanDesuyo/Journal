import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface ResponseRestAPI {
  statuscode: number;
  payload: {
    message: string;
    data?: any;
    info?: any;
  };
}
export interface UserToken extends JwtPayload {
  id: string;
  tokenversion: number;
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  payload?: {
    id: string;
    tokenversion: number;
  };
}
