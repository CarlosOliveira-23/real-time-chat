const { getMessages, saveMessage } = require('../controllers/messageController');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Novo usuário conectado');
    
    getMessages().then(messages => {
      socket.emit('chat history', messages);
    }).catch(err => {
      socket.emit('error', 'Erro ao carregar mensagens');
    });

    socket.on('chat message', async (msg) => {
      try {
        const savedMessage = await saveMessage(msg.sender, msg.message);
        io.emit('chat message', savedMessage);  // Enviar para todos os clientes
      } catch (err) {
        socket.emit('error', 'Erro ao enviar mensagem');
      }
    });

    socket.on('disconnect', () => {
      console.log('Usuário desconectado');
    });
  });
};

module.exports = { setupSocket };
