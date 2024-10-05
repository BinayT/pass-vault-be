"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VaultController_1 = require("../controllers/Vault/VaultController");
const router = express_1.default.Router();
// Route for getting all user vaults
router.get('/getallvaults', VaultController_1.getAllUserVaults);
// Route for getting a single vault entry
router.get('/getvault', VaultController_1.getSingleVault);
// Route for registering a single vault
router.post('/registervault', VaultController_1.registerVault);
// Route for updating a single vault
router.put('/updatevault', VaultController_1.updateVault);
// Route for deleting a single vault
router.delete('/deletevault', VaultController_1.deleteVault);
exports.default = router;
