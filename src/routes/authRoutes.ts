import express from 'express';
import { loginUser } from '@controllers/Auth/AuthController';

const router = express.Router();

// Route for user login
router.post('/login', loginUser);

export default router;