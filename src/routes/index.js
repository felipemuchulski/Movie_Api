const {Router} = require("express");

const userRouter = require("./user.routes");
const tagsRoutes = require("./tags.routes");
const notesRoutes = require("./notes.routes");
const routes = Router();

routes.use("/user", userRouter);
routes.use("/notes", notesRoutes);
routes.use("/tags", tagsRoutes);

module.exports = routes;