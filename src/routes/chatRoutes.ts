import express, { Request, Response, NextFunction } from 'express';
import * as expressValidator from 'express-validator';
import { getMessages, sendMessage } from '../controllers/messageController';

const { body, validationResult } = expressValidator;

const router = express.Router();

// Rota para enviar mensagens
router.post(
  '/send',
  [
    body('sender').notEmpty().withMessage('O campo "sender" é obrigatório.'),
    body('message').notEmpty().withMessage('O campo "message" é obrigatório.'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { sender, message } = req.body;
      const savedMessage = await sendMessage({ sender, message });
      res.status(201).json(savedMessage);
    } catch (err) {
      next(err);
    }
  }
);

// Rota para recuperar mensagens
router.get(
  '/messages',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await getMessages(req.query);
      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
