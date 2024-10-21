import express from 'express';
import { loginUser, registerUser } from '@controllers/Auth/AuthController';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

export default router;