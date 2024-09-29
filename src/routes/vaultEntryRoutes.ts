import express from 'express';
import {  } from '../controllers/User/UserController';
import { getAllUserVaults, registerVault, getSingleVault } from '../controllers/Vault/VaultController';

const router = express.Router();

// Route for getting all user vaults
router.get('/getallvaults', getAllUserVaults); 

// Route for getting a single vault entry
router.get('/getvault', getSingleVault); 

// Route for registering a single vault
router.post('/registervault', registerVault);

export default router;
