import winston, { format } from 'winston';

const logFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
        logFormat,
        format.errors({ stack: true })
    ),
    transports: [new winston.transports.File({ filename: './Log/error.log', level: 'error' })],
});

export function addConsoleTransport() {
    logger.add(new winston.transports.Console({}));
}

export default logger;
