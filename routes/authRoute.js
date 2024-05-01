import express from 'express';
import formidable from 'express-formidable';
import { registerController, loginController } from '../controllers/authController.js';

const router = express.Router()

router.post('/register', formidable(), registerController)

router.post('/login', loginController)

export default router;