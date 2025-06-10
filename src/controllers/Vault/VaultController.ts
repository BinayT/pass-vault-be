import { Request, Response } from 'express';
import { decryptPassword, encryptPassword } from '@helpers/passwordEncryption';
import pool from '@config/db';



export const registerVault = async (req: Request, res: Response): Promise<void> => {
    const { user_email, site, site_email, site_username, site_password, notes } = req.body;

    if (!user_email) {
        res.status(400).json({ message: 'No user found!' });
        return;
    }

    const { iv, encryptedData } = encryptPassword(site_password);

    try {
        await pool.query(
            'INSERT INTO vaults (user_email, site, site_email, site_username, site_password, notes, iv) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [user_email, site, site_email, site_username, encryptedData, notes, iv]
        );

        res.status(201).json({ message: 'Vault created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating vault', error });
    }
};



export const getAllUserVaults = async (req: Request, res: Response): Promise<void> => {
    const { user_email } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM vaults WHERE user_email = $1', [user_email]);
        res.status(200).json({ data: rows });
    } catch (error) {
        res.status(400).json({ message: 'Something unexpected happened. Please try again later.', error });
    }
}



export const getSingleVault = async (req: Request, res: Response): Promise<void> => {
    const { vault_id } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM vaults WHERE id = $1', [vault_id]);

        if (rows.length === 0) {
            res.status(400).json({ message: 'We are experiencing error opening this vault. Please try again later.' });
            return;
        }

        res.status(200).json({ data: rows });
    } catch (error) {
        res.status(400).json({ message: 'We are experiencing error opening this vault. Please try again later.', error });
    }
}



export const getDecryptedPassword = async (req: Request, res: Response): Promise<void> => {
    const { vault_id } = req.query;

    // Fetch the specific vault entry
    try {
        const { rows } = await pool.query('SELECT site_password, iv FROM vaults WHERE id = $1', [vault_id]);

        if (rows.length === 0) {
            res.status(404).json({ message: 'Vault not found' });
            return;
        }

        const decryptedPassword = decryptPassword(rows[0].site_password, rows[0].iv);
        res.status(200).json({ decryptedPassword });
    } catch (error) {
        res.status(404).json({ message: 'Vault not found' });
    }
};



export const updateVault = async (req: Request, res: Response): Promise<void> => {
    const { vault_id, site, site_email, site_username, site_password, notes } = req.body;

    if (!vault_id) {
        res.status(400).json({ message: 'No vault ID provided' });
        return;
    }

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (site) { fields.push(`site = $${idx++}`); values.push(site); }
    if (site_email) { fields.push(`site_email = $${idx++}`); values.push(site_email); }
    if (site_username) { fields.push(`site_username = $${idx++}`); values.push(site_username); }
    if (site_password) {
        const { iv, encryptedData } = encryptPassword(site_password);
        fields.push(`site_password = $${idx++}`); values.push(encryptedData);
        fields.push(`iv = $${idx++}`); values.push(iv);
    }
    if (notes) { fields.push(`notes = $${idx++}`); values.push(notes); }

    values.push(vault_id);

    const query = `UPDATE vaults SET ${fields.join(', ')} WHERE id = $${idx}`;

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Vault updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the vault', error });
    }
};



export const deleteVault = async (req: Request, res: Response): Promise<void> => {
    const {vault_id} = req.body;

    if(!vault_id){
        res.status(500).json({message: 'Something went wrong, please try again later!'})
    }

    try {
        await pool.query('DELETE FROM vaults WHERE id = $1', [vault_id]);
        res.status(200).json({ message: 'Vault deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the vault.', error });
    }
}

