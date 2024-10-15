import express from 'express';
import { getAllUserVaults, registerVault, getSingleVault, updateVault, deleteVault, getDecryptedPassword } from '@controllers/Vault/VaultController';
import { authenticateJWT } from '@middlewares/auth';

const router = express.Router();

// Route for getting all user vaults
router.get('/getallvaults', authenticateJWT, getAllUserVaults); 

// Route for getting a single vault entry
router.get('/getvault', authenticateJWT, getSingleVault); 
router.get('/getdecryptedvault', authenticateJWT, getDecryptedPassword); 

// Route for registering a single vault
router.post('/registervault', authenticateJWT, registerVault);

// Route for updating a single vault
router.put('/updatevault', authenticateJWT, updateVault);

// Route for deleting a single vault
router.delete('/deletevault', authenticateJWT, deleteVault);

export default router;
