// middlewares/logger.js
import morgan from 'morgan';

// Custom token for request ID
morgan.token('req-id', (req) => {
  return req.id || '-';
});

// Development logging format
export const dev = morgan('dev');

// Combined logging format for production
export const combined = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms');

// Custom logger with timestamp
export const custom = morgan(':timestamp :method :url :status :response-time ms - :res[content-length]', {
  stream: {
    write: (message) => {
      console.log(`[${new Date().toISOString()}] ${message.trim()}`);
    }
  }
});

// Default export
export const logger = {
  dev,
  combined,
  custom
};