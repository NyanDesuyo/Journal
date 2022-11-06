import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import cookieparser from "cookie-parser";
import "reflect-metadata";

import { corsConfig } from "./config";

import rootAPIRoutes from "./routes";

async function main() {
  dotenv.config();

  const serverApp = express();

  serverApp.use(express.json());
  serverApp.use(express.urlencoded({ extended: true }));

  serverApp.use(cors(corsConfig));

  serverApp.use(rootAPIRoutes);

  serverApp.listen(process.env.PORT, () => {
    console.log(`Server Up and Runing at port:${process.env.PORT}`);
  });
}

main().catch((err) => {
  console.log(err);
});
