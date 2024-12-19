import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setupSocket } from './socket/socketController';
import chatRouter from './routes/chatRoutes'; // Corrigido o import do chatRouter
import { protect } from './middleware/authMiddleware'; // Corrigido o import do middleware

dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => {
    console.log('Erro ao conectar ao MongoDB:', err);
  });

const app = express();
const server = http.createServer(app);

const io = new socketIo.Server(server);
setupSocket(io);

// Configurar as rotas de chat com proteção
app.use('/chat', protect, chatRouter); // Aqui aplicamos o middleware de autenticação

app.get('/', (req, res) => {
  res.send('Servidor de chat em tempo real');
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
