import express, {Request, Response} from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
