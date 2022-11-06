import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    message: "Status Ok!",
  });
});

export default router;
