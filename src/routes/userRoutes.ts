import express from 'express';
import { updateUser } from '@controllers/User/User';
import { authenticateJWT } from '@middlewares/auth';

const router = express.Router();

router.post('/update/:userId', authenticateJWT, updateUser);

export default router;