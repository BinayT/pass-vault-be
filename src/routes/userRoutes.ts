import express from 'express';
import { registerUser } from '@controllers/User/UserController';
import { loginUser } from '@controllers/Auth/AuthController';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

export default router;