import express from 'express';
import { registerUser, loginUser } from '../controllers/authController'; // Verifique o caminho

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

export default router;
