import { Request, Response } from 'express';
import { User } from '../models/src/models/User';
import { QP01Hash, checkQP01Hash, generateToken } from '../utils/authUtils';

export class UserController {
  public static async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const hash = QP01Hash(password);
      const isPasswordValid = checkQP01Hash(hash, user.passwd);

      if (isPasswordValid) {
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      const token = generateToken(user.id);

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll();

      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}