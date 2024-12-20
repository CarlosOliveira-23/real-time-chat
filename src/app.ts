import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import chatRouter from './routes/chatRoutes';
import authRouter from './routes/authRoutes';
import { setupSocket } from './socket/socketController';

dotenv.config();

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());

// Limitação de requisições (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Muitas requisições vindas deste IP, tente novamente mais tarde.',
});
app.use(limiter);

// Parse de JSON
app.use(express.json());

// Servidor HTTP e WebSocket
const server = http.createServer(app);
const io = new SocketIOServer(server);
setupSocket(io);

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
