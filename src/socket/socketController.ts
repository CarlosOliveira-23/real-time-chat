import { getMessages, sendMessage } from '../controllers/messageController'; // Caminho corrigido

const setupSocket = (io: any) => {
  io.on('connection', (socket: any) => {
    console.log('Novo usuário conectado');

    // Enviar histórico de mensagens para o cliente
    getMessages({} as any, {
      status: () => ({ json: (data: any) => socket.emit('chat history', data) }),
    } as any).catch((err) => {
      console.error('Erro ao carregar mensagens:', err);
      socket.emit('error', 'Erro ao carregar mensagens');
    });

    // Quando um usuário envia uma mensagem
    socket.on('chat message', async (msg: { sender: string; message: string }) => {
      try {
        const savedMessage = await sendMessage(
          { body: msg } as any,
          {
            status: () => ({
              json: (data: any) => io.emit('chat message', data),
            }),
          } as any
        );
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
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
