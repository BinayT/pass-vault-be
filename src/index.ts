import 'module-alias/register';
import express from 'express';

import authRoutes from '@routes/authRoutes';
import userRoutes from '@routes/userRoutes';
import vaultEntryRoutes from '@routes/vaultEntryRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vault', vaultEntryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
