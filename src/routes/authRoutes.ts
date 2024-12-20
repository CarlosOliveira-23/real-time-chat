import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { check } from 'express-validator';

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Nome é obrigatório').notEmpty(),
    check('email', 'Insira um email válido').isEmail(),
    check('password', 'Senha deve ter pelo menos 8 caracteres').isLength({ min: 8 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Insira um email válido').isEmail(),
    check('password', 'Senha é obrigatória').notEmpty(),
  ],
  loginUser
);

export default router;
