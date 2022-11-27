import { Router, Request, Response, NextFunction } from "express";
import { checkSchema, validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcryptjs";

import { prismaClient } from "../../config";

import { ResponseRestAPI, UserToken } from "../../interface";
import { accessToken, refreshToken, setCookie } from "../../function";
import { RegisterUserSchema, LoginUserSchema } from "../../schema";

const router = Router();
let responseRestAPI: ResponseRestAPI;

router.post(
  "/register",
  checkSchema(RegisterUserSchema),

  async (req: Request, res: Response, next: NextFunction) => {
    const validResult = validationResult(req);

    if (validResult.isEmpty()) {
      try {
        const { email, username, password, tokenversion } = req.body;

        const getUserData = await prismaClient.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
          select: {
            email: true,
            username: true,
          },
        });

        if (getUserData === null) {
          const salt = await genSalt(10);

          const hashedPass = await hash(password, salt);

          const userCreate = await prismaClient.user.create({
            data: {
              email,
              username,
              password: hashedPass,
            },
            select: {
              email: true,
              username: true,
            },
          });

          responseRestAPI = {
            statuscode: 200,
            payload: {
              message: "User have been Created",
              data: userCreate,
            },
          };
        } else {
          responseRestAPI = {
            statuscode: 400,
            payload: {
              message: "User have been already taken",
              data: getUserData,
            },
          };
        }
      } catch (error) {
        console.log(error);

        responseRestAPI = {
          statuscode: 500,
          payload: {
            message: "Something went Wrong",
            info: error,
          },
        };
      }
    } else {
      responseRestAPI = {
        statuscode: 400,
        payload: {
          message: "Check your POST Request",
          info: validResult.array(),
        },
      };
    }

    return res.status(responseRestAPI.statuscode).json(responseRestAPI.payload);
  }
);

router.post(
  "/login",
  checkSchema(LoginUserSchema),

  async (req: Request, res: Response, next: NextFunction) => {
    const validResult = validationResult(req);

    if (validResult.isEmpty()) {
      try {
        const { email, username, password } = req.body;

        const getUserData = await prismaClient.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
          select: {
            id: true,
            email: true,
            username: true,
            password: true,
            tokenversion: true,
          },
        });

        if (getUserData !== null) {
          const validPass = await compare(password, getUserData.password);

          if (validPass === true) {
            const accsessTokenData = accessToken({
              id: getUserData.id,
              tokenversion: getUserData.tokenversion,
            });
            const refreshTokenData = refreshToken({
              id: getUserData.id,
              tokenversion: getUserData.tokenversion,
            });

            setCookie(res, refreshTokenData);

            responseRestAPI = {
              statuscode: 200,
              payload: {
                message: "User logged in",
                info: {
                  accsessTokenData,
                  refreshTokenData,
                },
              },
            };
          }
        } else {
          responseRestAPI = {
            statuscode: 400,
            payload: {
              message: "Username or Email doesn't found in System",
            },
          };
        }
      } catch (error) {
        console.log(error);

        responseRestAPI = {
          statuscode: 500,
          payload: {
            message: "Something went Wrong",
            info: error,
          },
        };
      }
    } else {
      responseRestAPI = {
        statuscode: 400,
        payload: {
          message: "Check your POST Request",
          info: validResult.array(),
        },
      };
    }

    return res.status(responseRestAPI.statuscode).json(responseRestAPI.payload);
  }
);

export default router;
