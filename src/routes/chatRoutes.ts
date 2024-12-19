import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { sender, message } = req.body;
  try {
    const savedMessage = await sendMessage(sender, message);
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const messages = await getMessages();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao recuperar mensagens' });
  }
});

export default router;
