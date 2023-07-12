import jwt from "jsonwebtoken";
import User from "../models/User";
import { checkPassword } from "../services/password";
import authConfig from "../config/auth";

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    // Verify if email exists.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User / password invalid" });
    }

    // Verify if password is correct.
    const passwordMatched = await checkPassword(user, password);
    if (!passwordMatched) {
      return res.status(401).json({ error: "User / password invalid" });
    }

    const { id } = user;

    return res.json({
      user: {
        id,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionsController();
