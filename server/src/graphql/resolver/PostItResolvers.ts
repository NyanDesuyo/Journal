import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { ResponsePostIt } from "../model";
import { prismaClient } from "../../config";
import { GraphQLContext } from "../../interface";
import { graphqlAuth } from "../../middleware";
import {
  prismaSkipPage,
  prismaTakePage,
  prismaTotalPage,
} from "../../utils/PrismaHelper";

@Resolver(ResponsePostIt)
export class PostItResolver {
  @Query(() => ResponsePostIt)
  @UseMiddleware(graphqlAuth)
  async FindManyPostIt(
    @Arg("page", () => Int) page: number,
    @Arg("page_size", () => Int) page_size: number,
    @Ctx() Ctx: GraphQLContext
  ): Promise<ResponsePostIt> {
    try {
      const [rows, countRows] = await prismaClient.$transaction([
        prismaClient.postIt.findMany({
          skip: page ? prismaSkipPage(page, page_size) : undefined,
          take: page_size ? prismaTakePage(page_size) : undefined,
          where: {
            userId: Ctx.payload!.id,
          },
        }),
        prismaClient.postIt.count({
          where: {
            userId: Ctx.payload!.id,
          },
        }),
      ]);

      return {
        message: "Get All PostIt",
        data: rows,
        info: {
          total_page: prismaTotalPage(countRows, prismaTakePage(page_size)),
        },
      };
    } catch (error) {
      console.log(error);

      return {
        message: "Something went Wrong",
      };
    }
  }

  @Query(() => ResponsePostIt)
  @UseMiddleware(graphqlAuth)
  async FindOnePostIt(
    @Arg("id") id: string,
    @Ctx() Ctx: GraphQLContext
  ): Promise<ResponsePostIt> {
    try {
      const row = await prismaClient.postIt.findFirst({
        where: {
          id,
          userId: Ctx.payload!.id,
        },
      });

      return {
        message: "Get One PostIt",
        result: row,
      };
    } catch (error) {
      console.error(error);

      return {
        message: "Something went Wrong",
      };
    }
  }

  @Mutation(() => ResponsePostIt)
  @UseMiddleware(graphqlAuth)
  async CreatePostIt(
    @Arg("head") head: string,
    @Arg("body", { nullable: true }) body: string,
    @Arg("status") status: boolean,
    @Ctx() Ctx: GraphQLContext
  ): Promise<ResponsePostIt> {
    try {
      const result = await prismaClient.postIt.create({
        data: {
          head,
          body,
          status,
          userId: Ctx.payload!.id,
        },
      });

      return {
        message: "Create PostIt",
        result,
      };
    } catch (error) {
      console.log(error);

      return {
        message: "Something  went Wrong",
      };
    }
  }

  @Mutation(() => ResponsePostIt)
  @UseMiddleware(graphqlAuth)
  async UpdatePostIt(
    @Arg("ID") ID: string,
    @Arg("head", { nullable: true }) head: string,
    @Arg("body", { nullable: true }) body: string,
    @Arg("status", { nullable: true }) status: boolean,
    @Ctx() Ctx: GraphQLContext
  ): Promise<ResponsePostIt> {
    try {
      const checkUser = await prismaClient.postIt.count({
        where: {
          id: ID,
          userId: Ctx.payload!.id,
        },
      });

      if (checkUser > 0) {
        const result = await prismaClient.postIt.update({
          where: {
            id: ID,
          },
          data: {
            head,
            body,
            status,
          },
        });

        return {
          message: "Update PostIt Success",
          result,
        };
      } else {
        return {
          message: "Update PostIt Failed, Record not found",
        };
      }
    } catch (error) {
      console.log(error);

      return {
        message: "Something went Wrong",
      };
    }
  }

  @Mutation(() => ResponsePostIt)
  @UseMiddleware(graphqlAuth)
  async DeletePostIt(
    @Arg("ID") ID: string,
    @Ctx() Ctx: GraphQLContext
  ): Promise<ResponsePostIt> {
    try {
      const checkUser = await prismaClient.postIt.count({
        where: {
          id: ID,
          userId: Ctx.payload!.id,
        },
      });

      if (checkUser > 0) {
        const result = await prismaClient.postIt.delete({
          where: {
            id: ID,
          },
        });

        return {
          message: "Delete PostIt Success",
          result,
        };
      } else {
        return {
          message: "Delete PostIt Failed, Record not found",
        };
      }
    } catch (error) {
      console.log(error);

      return {
        message: "Something went Wrong",
      };
    }
  }
}
