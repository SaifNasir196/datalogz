import cors from 'cors';

import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node'
import express, { Application, Request, Response, NextFunction } from 'express'

const PORT = process.env.PORT || 3000
const app: Application = express()

const corsOptions = {
  origin: ['https://datalogz-io.vercel.app', 'http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));

// Clerk authentication middleware
const clerkAuth = ClerkExpressRequireAuth({
  authorizedParties: ['https://datalogz-io.vercel.app', 'http://localhost:3000'],
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(401).json({ error: 'Authentication failed' });
});



app.get('/api', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Protected route example
app.get('/api/protected-data', clerkAuth, (req, res) => {
  res.json({ message: 'This is protected data from the Express backend' });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});