import Message, { IMessage } from '../models/messageModel';

export const getMessages = async (): Promise<IMessage[]> => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    return messages;
  } catch (err) {
    console.error('Erro ao recuperar mensagens:', err);
    throw new Error('Erro ao recuperar mensagens');
  }
};

export const sendMessage = async (sender: string, message: string): Promise<IMessage> => {
  try {
    const newMessage = new Message({ sender, message });
    await newMessage.save();
    return newMessage;
  } catch (err) {
    console.error('Erro ao salvar mensagem:', err);
    throw new Error('Erro ao salvar mensagem');
  }
};
