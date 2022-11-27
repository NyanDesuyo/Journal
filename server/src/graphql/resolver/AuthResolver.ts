import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { compare, genSalt, hash } from "bcryptjs";

import { AuthModel } from "../model";
import { prismaClient } from "../../config";
import { accessToken, refreshToken, setCookie } from "../../function";
import { GraphQLContext } from "../../interface";

@Resolver(AuthModel)
export class AuthResolver {
  @Query(() => String)
  helloWorld() {
    return "Hello World!";
  }

  @Mutation(() => AuthModel)
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<AuthModel> {
    try {
      const _userData = await prismaClient.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
        select: {
          email: true,
          username: true,
        },
      });

      if (_userData === null) {
        const _salt = await genSalt(10);
        const _hashedPass = await hash(password, _salt);

        await prismaClient.user.create({
          data: {
            email,
            username,
            password: _hashedPass,
          },
          select: {
            email: true,
            username: true,
          },
        });

        return {
          message: "User have been Created",
        };
      } else {
        return {
          message: "User have been already taken",
        };
      }
    } catch (error) {
      console.log(error);

      return {
        message: "Something went Wrong",
      };
    }
  }

  @Mutation(() => AuthModel)
  async login(
    @Arg("email", { nullable: true }) email: string,
    @Arg("username", { nullable: true }) username: string,
    @Arg("password") password: string,
    @Ctx() { req, res }: GraphQLContext
  ): Promise<AuthModel> {
    try {
      const _userData = await prismaClient.user.findFirst({
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

      if (_userData !== null) {
        const _comparePass = await compare(password, _userData.password);

        if (_comparePass === true) {
          const _accessToken = accessToken({
            id: _userData.id,
            tokenversion: _userData.tokenversion,
          });

          const _refreshToken = refreshToken({
            id: _userData.id,
            tokenversion: _userData.tokenversion,
          });

          setCookie(res, _refreshToken);

          return {
            message: "User Logged In",
            accessToken: _accessToken,
            refreshToken: _refreshToken,
          };
        } else {
          return {
            message: "Wrong User password",
          };
        }
      } else {
        return {
          message: "Username or Email doesn't exist",
        };
      }
    } catch (error) {
      console.log(error);

      return {
        message: "Something went Wrong",
        info: error,
      };
    }
  }
}
