import { Request, Response } from "express";
import DataSource from "../data-source";
import { User } from "../entity/User";
import { encrypt } from "../helpers/encypt.helper";
import * as cache from "memory-cache";

export class UserController {
  static async signup(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const encryptedPassword = await encrypt.encryptpass(password);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = encryptedPassword;

    const userRepository = DataSource.getRepository(User);
    await userRepository.save(user);

    return res
      .status(200)
      .json({ message: "User created successfully", name, email });
  }

  static async getUsers(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("serving from db");
      const userRepository = DataSource.getRepository(User);
      const users = await userRepository.find();

      cache.put("data", users, 6000);
      return res.status(200).json({
        data: users,
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const userRepository = DataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    user.name = name;
    user.email = email;
    user.role = role;
    await userRepository.save(user);
    res.status(200).json({ message: "udpdate", user });
  }

  static async changeUserPassword(req: Request, res: Response) {
    //TODO
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = DataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    await userRepository.remove(user);
    res.status(200).json({ message: "ok" });
  }
}
