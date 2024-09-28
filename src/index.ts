import express from 'express';

import userRoutes from './routes/userRoutes'; // Adjust based on your file location

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
