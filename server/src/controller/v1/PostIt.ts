import { Router, Request, Response, NextFunction } from "express";
import { checkSchema, validationResult } from "express-validator";

import { prismaClient } from "../../config";
import { ResponseRestAPI, UserToken } from "../../interface";
import { parseToken } from "../../function";
import {
  GETPostItSchema,
  GETSpesificPostItSchema,
  POSTPostItSchema,
  PUTPostItSchema,
  DELETEPostItSchema,
} from "../../schema";
import {
  prismaSkipPage,
  prismaTakePage,
  prismaTotalPage,
} from "../../utils/PrismaHelper";
import {
  serverError,
  validationError,
} from "../../utils/ResponseRestAPIHelper";

const router = Router();
let responseRestAPI: ResponseRestAPI;

router.get(
  "/",
  checkSchema(GETPostItSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const userToken: UserToken = parseToken(
      req.headers.authorization as string
    );
    const validResult = validationResult(req);

    if (validResult.isEmpty()) {
      try {
        const { page, page_size }: any = req.query;

        const [rows, countRows] = await prismaClient.$transaction([
          prismaClient.postIt.findMany({
            skip: prismaSkipPage(page, page_size),
            take: prismaTakePage(page_size),
            where: {
              userId: userToken.id,
            },
          }),
          prismaClient.postIt.count({
            where: {
              userId: userToken.id,
            },
          }),
        ]);

        responseRestAPI = {
          statuscode: 200,
          payload: {
            message: " Get All PostIt",
            data: rows,
            info: {
              total_page: prismaTotalPage(countRows, prismaTakePage(page_size)),
            },
          },
        };
      } catch (error) {
        console.log(error);

        responseRestAPI = serverError(error);
      }
    } else {
      responseRestAPI = validationError(validResult.array());
    }

    return res.status(responseRestAPI.statuscode).json(responseRestAPI.payload);
  }
);

router.get(
  "/:id",
  checkSchema(GETSpesificPostItSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const userToken: UserToken = parseToken(
      req.headers.authorization as string
    );
    const validResult = validationResult(req);

    if (validResult.isEmpty()) {
      try {
        const { id }: any = req.params;

        const [row] = await prismaClient.$transaction([
          prismaClient.postIt.findFirst({
            where: {
              id,
              userId: userToken.id,
            },
          }),
        ]);

        responseRestAPI = {
          statuscode: 200,
          payload: {
            message: " Get One PostIt",
            data: row,
          },
        };
      } catch (error) {
        console.log(error);

        responseRestAPI = serverError(error);
      }
    } else {
      responseRestAPI = validationError(validResult.array());
    }

    return res.status(responseRestAPI.statuscode).json(responseRestAPI.payload);
  }
);

router.post(
  "/",
  checkSchema(POSTPostItSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const userToken: UserToken = parseToken(
      req.headers.authorization as string
    );
    const validResult = validationResult(req);

    if (validResult.isEmpty()) {
      try {
        const { head, body, status }: any = req.body;

        const result = await prismaClient.postIt.create({
          data: {
            head,
            body,
            status,
            userId: userToken.id,
          },
        });

        responseRestAPI = {
          statuscode: 200,
          payload: {
            message: "Create a PostIt",
            data: result,
          },
        };
      } catch (error) {
        console.log(error);

        responseRestAPI = serverError(error);
      }
    } else {
      responseRestAPI = validationError(validResult.array());
    }

    return res.status(responseRestAPI.statuscode).json(responseRestAPI.payload);
  }
);

router.put(
  "/:id",
  checkSchema(PUTPostItSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const userToken: UserToken = parseToken(
      req.headers.authorization as string
    );
    const validResult = validationResult(req);

    if (validResult.isEmpty()) {
      try {
        const { id }: any = req.params;
        const { head, body, status }: any = req.body;

        const _validPost = await prismaClient.postIt.count({
          where: {
            id,
            userId: userToken.id,
          },
        });

        if (_validPost > 0) {
          const result = await prismaClient.postIt.update({
            where: {
              id,
            },
            data: {
              head,
              body,
              status,
            },
          });

          responseRestAPI = {
            statuscode: 200,
            payload: {
              message: "Update a PostIt",
              data: result,
            },
          };
        } else {
          responseRestAPI = {
            statuscode: 401,
            payload: {
              message: "Can't update PostIt",
            },
          };
        }
      } catch (error) {
        console.log(error);

        responseRestAPI = serverError(error);
      }
    } else {
      responseRestAPI = validationError(validResult.array());
    }

    return res.status(responseRestAPI.statuscode).json(responseRestAPI.payload);
  }
);

router.delete(
  "/:id",
  checkSchema(DELETEPostItSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const userToken: UserToken = parseToken(
      req.headers.authorization as string
    );
    const validResult = validationResult(req);

    if (validResult.isEmpty()) {
      try {
        const { id }: any = req.params;

        const _validPost = await prismaClient.postIt.count({
          where: {
            id,
            userId: userToken.id,
          },
        });

        if (_validPost > 0) {
          const result = await prismaClient.postIt.delete({
            where: {
              id,
            },
          });

          responseRestAPI = {
            statuscode: 200,
            payload: {
              message: "Delete a PostIt",
              data: result,
            },
          };
        } else {
          responseRestAPI = {
            statuscode: 401,
            payload: {
              message: "Can't delete PostIt",
            },
          };
        }
      } catch (error) {
        console.log(error);

        responseRestAPI = serverError(error);
      }
    } else {
      responseRestAPI = validationError(validResult.array());
    }

    return res.status(responseRestAPI.statuscode).json(responseRestAPI.payload);
  }
);

export default router;
