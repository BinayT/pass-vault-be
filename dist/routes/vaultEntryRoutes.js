"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VaultController_1 = require("@controllers/Vault/VaultController");
const auth_1 = require("@middlewares/auth");
const router = express_1.default.Router();
// Route for getting all user vaults
router.get('/getallvaults', auth_1.authenticateJWT, VaultController_1.getAllUserVaults);
// Route for getting a single vault entry
router.get('/getvault', auth_1.authenticateJWT, VaultController_1.getSingleVault);
router.get('/getdecryptedvault', auth_1.authenticateJWT, VaultController_1.getDecryptedPassword);
// Route for registering a single vault
router.post('/registervault', auth_1.authenticateJWT, VaultController_1.registerVault);
// Route for updating a single vault
router.put('/updatevault', auth_1.authenticateJWT, VaultController_1.updateVault);
// Route for deleting a single vault
router.delete('/deletevault', auth_1.authenticateJWT, VaultController_1.deleteVault);
exports.default = router;
