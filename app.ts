import express, { Request, Response } from 'express';
import { getAllUsers } from './controllers/user.controller';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express is working!');
});

app.get('/api/users', getAllUsers);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
