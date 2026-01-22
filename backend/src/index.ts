import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { prisma } from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite frontend
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 2. Health Check Route
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`; // Test DB connection
        res.json({ status: 'ok', database: 'connected', server: 'FoxBase Backend' });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

// 3. Start Server
app.listen(PORT, () => {
    console.log(`🦊 FoxBase Backend running at http://localhost:${PORT}`);
});