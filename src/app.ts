import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import statusMonitor from 'express-status-monitor';
import chatRouter from './routes/chatRoutes';
import authRouter from './routes/authRoutes';
import { setupSocket } from './socket/socketController';
import logger from './services/logger';

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

// Middleware de logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
});

// Monitoramento de status
app.use(statusMonitor());
app.get('/status', (req: Request, res: Response) => {
  res.sendFile(require.resolve('express-status-monitor/public/index.html'));
});

// Parse de JSON
app.use(express.json());

// Servidor HTTP e WebSocket
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
setupSocket(io);

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info('Conectado ao MongoDB');
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => {
    logger.error('Erro ao conectar ao MongoDB:', err);
    console.error('Erro ao conectar ao MongoDB:', err);
  });


// Middleware de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
  });
  res.status(err.status || 500).json({
    error: 'Ocorreu um erro interno no servidor.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  logger.info(`Servidor rodando na porta ${PORT}`);
});
