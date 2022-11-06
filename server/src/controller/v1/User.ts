import { Router, Request, Response, NextFunction } from "express";
import { checkSchema, validationResult } from "express-validator";
import { genSalt, hash, compare } from "bcryptjs";

import { prismaClient } from "../../config";

const router = Router();

router.post(
  "/register",
  checkSchema({
    // name: {},
    // email: {},
    // username: {},
    // password: {},
  }),

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

          return res.status(200).json({
            message: "User have been Created",
            data: userCreate,
          });
        } else {
          return res.status(400).json({
            message: "User have been already taken",
            data: getUserData,
          });
        }
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          message: "Something went Wrong",
          info: error,
        });
      }
    } else {
      return res.status(400).json({
        message: "Check your POST Request",
        data: validResult.array(),
      });
    }
  }
);

export default router;
