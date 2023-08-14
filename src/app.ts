import express, { Express } from 'express';
import cors from 'cors';
import alarmOccurrenceRoutes from './routes/alarmOccurrence.route'

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api', alarmOccurrenceRoutes);

export default app;
