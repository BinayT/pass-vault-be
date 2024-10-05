"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVault = exports.updateVault = exports.getSingleVault = exports.getAllUserVaults = exports.registerVault = void 0;
const db_1 = __importDefault(require("../../config/db"));
const registerVault = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_email, site, site_email, site_username, site_password, notes } = req.body;
    // Validate that userId is present
    if (!user_email) {
        res.status(400).json({ message: 'No user found!' });
        return;
    }
    // Save the new vault to db.
    const dataToSave = {
        user_email,
        site,
        site_email,
        site_username,
        site_password,
        notes
    };
    // Insert the new vault into the vaults table
    const { error } = yield db_1.default.from('vaults').insert(dataToSave);
    if (error) {
        res.status(500).json({ message: 'Error creating vault', error });
        return;
    }
    res.status(201).json({ message: 'Vault created successfully' });
});
exports.registerVault = registerVault;
const getAllUserVaults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_email } = req.body;
    const { data: allVault, error } = yield db_1.default
        .from('vaults')
        .select('*')
        .eq('user_email', user_email);
    if (error) {
        res.status(400).json({ message: 'Something unexpected happened. Please try again later.', error: error });
        return;
    }
    res.status(200).json({ data: allVault });
});
exports.getAllUserVaults = getAllUserVaults;
const getSingleVault = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vault_id } = req.body;
    const { data: valut, error } = yield db_1.default
        .from('vaults')
        .select('*')
        .eq('id', vault_id);
    if (error) {
        res.status(400).json({ message: 'We are experiencing error opening this vault. Please try again later.', error: error });
        return;
    }
    res.status(200).json({ data: valut });
});
exports.getSingleVault = getSingleVault;
const updateVault = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vault_id, site, site_email, site_username, site_password, notes } = req.body;
    // Validate that vault_id is present
    if (!vault_id) {
        res.status(400).json({ message: 'No vault ID provided' });
        return;
    }
    // Object containing the fields to update
    const fieldsToUpdate = {};
    if (site)
        fieldsToUpdate.site = site;
    if (site_email)
        fieldsToUpdate.site_email = site_email;
    if (site_username)
        fieldsToUpdate.site_username = site_username;
    if (site_password)
        fieldsToUpdate.site_password = site_password;
    if (notes)
        fieldsToUpdate.notes = notes;
    // Update the vault with the given fields
    const { error } = yield db_1.default
        .from('vaults')
        .update(fieldsToUpdate)
        .eq('id', vault_id);
    if (error) {
        res.status(500).json({ message: 'Error updating the vault', error });
        return;
    }
    res.status(200).json({ message: 'Vault updated successfully' });
});
exports.updateVault = updateVault;
const deleteVault = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vault_id } = req.body;
    if (!vault_id) {
        res.status(500).json({ message: 'Something went wrong, please try again later!' });
    }
    const { error } = yield db_1.default
        .from('vaults')
        .delete()
        .eq('id', vault_id);
    if (error) {
        res.status(500).json({ message: 'Error deleting the vault.', error });
        return;
    }
    res.status(200).json({ message: 'Vault deleted successfully' });
});
exports.deleteVault = deleteVault;
