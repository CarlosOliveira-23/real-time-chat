import { getMessages, sendMessage } from '../controllers/messageController'; // Caminho corrigido

const setupSocket = (io: any) => {
  io.on('connection', (socket: any) => {
    console.log('Novo usuário conectado');

    getMessages()
      .then((messages) => {
        socket.emit('chat history', messages);
      })
      .catch((err) => {
        console.error('Erro ao carregar mensagens:', err);
        socket.emit('error', 'Erro ao carregar mensagens');
      });

    // Quando um usuário envia uma mensagem
    socket.on('chat message', async (msg: { sender: string; message: string }) => {
      try {
        const savedMessage = await sendMessage(msg.sender, msg.message);
        io.emit('chat message', savedMessage);
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        socket.emit('error', 'Erro ao enviar mensagem');
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuário desconectado');
    });
  });
};

export { setupSocket };
