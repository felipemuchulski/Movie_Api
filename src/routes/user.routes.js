const {Router} = require("express");

const UserControllers = require("../controllers/UserController");
const userRoutes = Router();

const userController = new UserControllers();

userRoutes.post("/", userController.create);
userRoutes.create("/:id", userController.update);

module.exports = userRoutes;