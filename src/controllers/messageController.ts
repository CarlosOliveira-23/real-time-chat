import Message from '../models/messageModel';
import { IMessage } from '../models/messageModel';

// Função para recuperar todas as mensagens
export const getMessages = async (): Promise<IMessage[]> => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    return messages;
  } catch (err) {
    console.error('Erro ao recuperar mensagens:', err);
    throw new Error('Erro ao recuperar mensagens');
  }
};

// Função para salvar uma mensagem
export const saveMessage = async (sender: string, message: string): Promise<IMessage> => {
  try {
    const newMessage = new Message({ sender, message });
    await newMessage.save();
    return newMessage;
  } catch (err) {
    console.error('Erro ao salvar mensagem:', err);
    throw new Error('Erro ao salvar mensagem');
  }
};
