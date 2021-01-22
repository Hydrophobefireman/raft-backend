const { Router } = require("express");
const userRouter = require("./Users");
const graphRouter = require("./Graph");

const baseRouter = new Router();

baseRouter.use("/users", userRouter);
baseRouter.use("/graph", graphRouter);

module.exports = baseRouter;
