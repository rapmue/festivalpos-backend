import * as express from "express";
import { authentification } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { authorization } from "../middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
const Router = express.Router();

Router.get(
  "/auth/users",
  authentification,
  authorization(["admin"]),
  UserController.getUsers
);
Router.get(
  "/auth/user/:id",
  authentification,
  authorization(["admin"]),
  AuthController.getProfile
);
Router.post(
    "/auth/user",
    authentification,
    authorization(["admin"]),
    UserController.signup
);
Router.post("/auth/login", AuthController.login);
Router.put(
  "/auth/user/:id",
  authentification,
  authorization(["user", "admin"]),
  UserController.updateUser
);
Router.delete(
  "/auth/user/:id",
  authentification,
  authorization(["admin"]),
  UserController.deleteUser
);
export { Router as userRouter };