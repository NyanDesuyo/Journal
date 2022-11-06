import { Router } from "express";

const routes = Router();

import v1 from "./v1";
routes.use("/v1", v1);

import status from "../controller/status";
routes.use("/status", status);

export default routes;
