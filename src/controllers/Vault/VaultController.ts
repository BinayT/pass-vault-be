import { Request, Response } from 'express';
import { decryptPassword, encryptPassword } from '@helpers/passwordEncryption';
import supabase from '@config/db';



export const registerVault = async (req: Request, res: Response): Promise<void> => {
    const { user_email, site, site_email, site_username, site_password, notes } = req.body;

     if (!user_email) {
        res.status(400).json({ message: 'No user found!' });
        return;
    }

    const {iv, encryptedData} = encryptPassword(site_password)
    const dataToSave = {
        user_email,
        site,
        site_email,
        site_username,
        site_password : encryptedData,
        notes, 
        iv
    }

     const { error } = await supabase.from('vaults').insert(dataToSave);

     if (error) {
         res.status(500).json({ message: 'Error creating vault', error });
         return;
     }
     res.status(201).json({ message: 'Vault created successfully' });
};



export const getAllUserVaults = async (req: Request, res: Response): Promise<void> => {
    const { user_email } = req.body;
    const {data: allVault, error} = await supabase
    .from('vaults')
    .select('*')
    .eq('user_email', user_email)

    if (error) {
        res.status(400).json({ message: 'Something unexpected happened. Please try again later.', error: error });
        return;
    }

    res.status(200).json({ data: allVault });
}



export const getSingleVault = async (req: Request, res: Response): Promise<void> => {
    const { vault_id } = req.body;
    const {data: valut, error} = await supabase
    .from('vaults')
    .select('*')
    .eq('id', vault_id)

    if (error) {
        res.status(400).json({ message: 'We are experiencing error opening this vault. Please try again later.', error: error });
        return;
    }

    res.status(200).json({ data: valut });
}



export const getDecryptedPassword = async (req: Request, res: Response): Promise<void> => {
    const { vault_id } = req.query;

    // Fetch the specific vault entry
    const { data: vault, error } = await supabase
        .from('vaults')
        .select('site_password, iv')
        .eq('id', vault_id)
        .single();

    if (error || !vault) {
        res.status(404).json({ message: 'Vault not found' });
        return;
    }

    const decryptedPassword = decryptPassword(vault.site_password, vault.iv);
    res.status(200).json({ decryptedPassword });
};



export const updateVault = async (req: Request, res: Response): Promise<void> => {
    const { vault_id, site, site_email, site_username, site_password, notes } = req.body;

    if (!vault_id) {
        res.status(400).json({ message: 'No vault ID provided' });
        return;
    }

    const fieldsToUpdate: Record<string, any> = {};

    if (site) fieldsToUpdate.site = site;
    if (site_email) fieldsToUpdate.site_email = site_email;
    if (site_username) fieldsToUpdate.site_username = site_username;
    if (site_password) fieldsToUpdate.site_password = site_password;
    if (notes) fieldsToUpdate.notes = notes;

    const { error } = await supabase
        .from('vaults')
        .update(fieldsToUpdate)
        .eq('id', vault_id);

    if (error) {
        res.status(500).json({ message: 'Error updating the vault', error });
        return;
    }

    res.status(200).json({ message: 'Vault updated successfully' });
};



export const deleteVault = async (req: Request, res: Response): Promise<void> => {
    const {vault_id} = req.body;

    if(!vault_id){
        res.status(500).json({message: 'Something went wrong, please try again later!'})
    }

    const {error} = await supabase
        .from('vaults')
        .delete()
        .eq('id', vault_id);

    if (error) {
        res.status(500).json({ message: 'Error deleting the vault.', error });
        return;
    }

    res.status(200).json({ message: 'Vault deleted successfully' });
}