import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '@/config';
import { DatabaseConnection } from '@/config';


export const app: Application = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))
app.use(helmet());
app.use(express.json());

app.get('/', (_, res) => {
    res.json({
        message: "Dialify - API",
        status: "running",
        database: DatabaseConnection.getInstance().getStatus(),
        timestamp: new Date().toISOString()
    });
})