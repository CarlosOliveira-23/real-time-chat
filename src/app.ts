import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chatRouter from './routes/chatRoutes';
import { setupSocket } from './socket/socketController';

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server);
setupSocket(io);

app.use('/api/chat', chatRouter);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
