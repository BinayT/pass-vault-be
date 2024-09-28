import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/User/UserController';

const router = express.Router();

// Route for user registration
router.get('/getallusers', getAllUsers); 
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

export default router;
