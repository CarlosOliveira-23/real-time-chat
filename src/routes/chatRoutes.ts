import express, { Request, Response } from 'express';
import { getMessages, sendMessage } from '../controllers/messageController';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Rota para enviar mensagens
router.post(
  '/send',
  [
    // Validações de entrada
    body('sender').notEmpty().withMessage('O campo "sender" é obrigatório.'),
    body('message').notEmpty().withMessage('O campo "message" é obrigatório.'),
  ],
  async (req: Request, res: Response) => {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sender, message } = req.body;

    try {
      // Aqui corrigimos para passar os argumentos individualmente
      const savedMessage = await sendMessage(sender, message);
      res.status(201).json(savedMessage);
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      res.status(500).json({ error: 'Erro ao enviar mensagem', details: err.message || 'Erro desconhecido' });
    }
  }
);

// Rota para recuperar mensagens
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const messages = await getMessages(req, res);
    res.status(200).json(messages);
  } catch (err: any) {
    console.error('Erro ao recuperar mensagens:', err);
    res.status(500).json({ error: 'Erro ao recuperar mensagens', details: err.message || 'Erro desconhecido' });
  }
});

export default router;
