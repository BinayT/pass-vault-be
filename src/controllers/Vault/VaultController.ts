import { Request, Response } from 'express';
import supabase from '../../config/db';

export const registerVault = async (req: Request, res: Response): Promise<void> => {
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
    }

     // Insert the new vault into the vaults table
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


export const updateVault = async (req: Request, res: Response): Promise<void> => {
    const { vault_id, site, site_email, site_username, site_password, notes } = req.body;

    // Validate that vault_id is present
    if (!vault_id) {
        res.status(400).json({ message: 'No vault ID provided' });
        return;
    }

    // Object containing the fields to update
    const fieldsToUpdate: Record<string, any> = {};

    if (site) fieldsToUpdate.site = site;
    if (site_email) fieldsToUpdate.site_email = site_email;
    if (site_username) fieldsToUpdate.site_username = site_username;
    if (site_password) fieldsToUpdate.site_password = site_password;
    if (notes) fieldsToUpdate.notes = notes;

    // Update the vault with the given fields
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