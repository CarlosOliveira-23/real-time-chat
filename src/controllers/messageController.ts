import { Request, Response } from 'express';
import Message, { IMessage } from '../models/messageModel';

// Recupera mensagens com paginação
export const getMessages = async (query: any): Promise<any> => {
  const page = parseInt(query.page as string) || 1; // Página padrão é 1
  const limit = parseInt(query.limit as string) || 10; // Limite padrão é 10

  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 }) // Ordena por mais recentes
      .skip((page - 1) * limit) // Pula mensagens para a página correta
      .limit(limit); // Limita o número de mensagens

    const totalMessages = await Message.countDocuments(); // Conta o total de mensagens
    return {
      messages,
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: page,
    };
  } catch (err: any) {
    throw new Error(err.message || 'Erro ao recuperar mensagens');
  }
};


// Envia uma mensagem com timestamp
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { sender, message } = req.body;

  if (!sender || !message) {
    res.status(400).json({ message: 'Os campos "sender" e "message" são obrigatórios.' });
    return;
  }

  try {
    const newMessage = new Message({ sender, message, timestamp: Date.now() });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err: any) {
    console.error('Erro ao salvar mensagem:', err);
    res.status(500).json({
      message: 'Erro ao salvar mensagem',
      error: err?.message || 'Erro desconhecido',
    });
  }
};

// Busca mensagens por remetente ou palavra-chave
export const searchMessages = async (req: Request, res: Response): Promise<void> => {
  const sender = req.query.sender as string | undefined;
  const keyword = req.query.keyword as string | undefined;

  try {
    const filter: any = {};
    if (sender) filter.sender = sender; // Filtra por remetente
    if (keyword) filter.message = { $regex: keyword, $options: 'i' }; // Filtra por palavra-chave (case-insensitive)

    const messages = await Message.find(filter).sort({ timestamp: -1 }); // Ordena as mensagens mais recentes
    res.status(200).json(messages);
  } catch (err: any) {
    console.error('Erro ao buscar mensagens:', err);
    res.status(500).json({
      message: 'Erro ao buscar mensagens',
      error: err?.message || 'Erro desconhecido',
    });
  }
};

// Deleta uma mensagem por ID
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      res.status(404).json({ message: 'Mensagem não encontrada.' });
      return;
    }

    res.status(200).json({ message: 'Mensagem deletada com sucesso.', deletedMessage });
  } catch (err: any) {
    console.error('Erro ao deletar mensagem:', err);
    res.status(500).json({
      message: 'Erro ao deletar mensagem',
      error: err?.message || 'Erro desconhecido',
    });
  }
};
