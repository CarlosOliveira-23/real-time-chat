import { getMessages, saveMessage } from '../controllers/messageController';

const setupSocket = (io: any) => {
  io.on('connection', (socket: any) => {
    console.log('Novo usuário conectado');

    // Enviar histórico de mensagens para o cliente
    getMessages()
      .then(messages => {
        socket.emit('chat history', messages);  // Envia as mensagens para o cliente
      })
      .catch(err => {
        socket.emit('error', 'Erro ao carregar mensagens');
      });

    // Quando um usuário envia uma mensagem
    socket.on('chat message', async (msg: { sender: string; message: string }) => {
      try {
        const savedMessage = await saveMessage(msg.sender, msg.message);
        io.emit('chat message', savedMessage);  // Enviar para todos os clientes
      } catch (err) {
        socket.emit('error', 'Erro ao enviar mensagem');
      }
    });

    // Quando o usuário se desconecta
    socket.on('disconnect', () => {
      console.log('Usuário desconectado');
    });
  });
};

export { setupSocket };
