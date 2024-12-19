const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { setupSocket } = require('./socket/socketController'); // Importando o controller do socket

dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => {
    console.log('Erro ao conectar ao MongoDB:', err);
  });

const app = express();
const server = http.createServer(app);

// Inicializando o Socket.IO com o servidor
const io = socketIo(server);

// Configurando as funcionalidades do Socket.IO
setupSocket(io);

app.get('/', (req, res) => {
  res.send('Servidor de chat em tempo real');
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
