import express from 'express';

import userRoutes from '@routes/userRoutes';
import vaultEntryRoutes from '@routes/vaultEntryRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vaults', vaultEntryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
