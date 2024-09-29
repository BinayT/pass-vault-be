import express from 'express';
import {  } from '../controllers/User/UserController';
import { getAllUserVaults, registerVault } from '../controllers/Vault/VaultController';

const router = express.Router();

// Route for getting all user vaults
router.get('/getallvaults', getAllUserVaults); 

// Route for registering a single vault
router.post('/registervault', registerVault);

export default router;
