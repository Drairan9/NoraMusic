import { config } from 'dotenv';
import logger, { addConsoleTransport } from './Logger.js';

if (process.env.NODE_ENV !== 'production') {
    addConsoleTransport();
    config();
    logger.info('Running in development mode.');
} else {
    logger.info('Running in production mode.');
}

export default () => {
    return;
};
