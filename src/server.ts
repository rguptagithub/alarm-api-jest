import express from 'express';
import http from 'http';
import cors from 'cors' 
import mongoose from 'mongoose';
import alarmOccurrenceRoutes    from './routes/alarmOccurrence.route';
import Logging from './library/Logging';
import dotenv from 'dotenv';

dotenv.config();

const router = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/alarmsdb';

mongoose
    .connect(MONGO_URL, { retryWrites: true, w: 'majority' })    
    .then(() => {
        Logging.info('MongoDB connected successfully !!!');
        StartServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect :');
        Logging.error(error);
    });

const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the Request */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the Response */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(cors());
    router.use(express.json());

    /** API Rules */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */   
    router.use('/api', alarmOccurrenceRoutes);


    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }));

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');

        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    http.createServer(router).listen(PORT, () => Logging.info(`Server is running on :  http://localhost:${PORT}`));
};

