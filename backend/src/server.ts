import express, { Request, Response } from 'express';
import recipeRoutes from './routes/recipes.routes';
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/recipes', recipeRoutes)
app.get('/', (req: Request, res: Response) => {
  res.send({'res': 'Hello World!'});
});


app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});