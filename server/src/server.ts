import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";

import { corsConfig } from "./config";
import { SERVER_PORT } from "./constant";
import SchemaCollection from "./graphql";
import { expressJWTMiddleware, morganMiddleware } from "./middleware";

import rootAPIRoutes from "./routes";

async function main() {
  const serverApp = express();

  serverApp.use(express.json());
  serverApp.use(express.urlencoded({ extended: true }));

  serverApp.use(cors(corsConfig));
  serverApp.use(cookieparser());
  serverApp.use(expressJWTMiddleware);
  serverApp.use(morganMiddleware);

  serverApp.use(rootAPIRoutes);

  const appoloServer = new ApolloServer({
    schema: SchemaCollection,
    context: ({ req, res }) => ({ req, res }),
  });

  await appoloServer.start();
  appoloServer.applyMiddleware({ app: serverApp });

  serverApp.listen(SERVER_PORT, () => {
    console.log(`Server Up and Runing at port:${SERVER_PORT}`);
  });
}

main().catch((err) => {
  console.log(err);
});
