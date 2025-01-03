import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado, token não fornecido' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string); // Tipo do payload do token
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
