import { Request, Response, NextFunction } from 'express';

interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  ip?: string;
  userAgent?: string;
  error?: string;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(entry: LogEntry): void {
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log(JSON.stringify(entry));
    } else {
      const { timestamp, method, url, statusCode, responseTime } = entry;
      const status = statusCode ? `${statusCode}` : 'N/A';
      const time = responseTime ? `${responseTime}ms` : 'N/A';
      console.log(`[${timestamp}] ${method} ${url} - ${status} (${time})`);
    }
  }

  getLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit);
  }

  getErrorLogs(limit: number = 50): LogEntry[] {
    return this.logs
      .filter(log => log.statusCode && log.statusCode >= 400)
      .slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const logger = Logger.getInstance();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    logger.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent')
    });
  });

  next();
}

export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction): void {
  const logger = Logger.getInstance();
  
  logger.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode: res.statusCode || 500,
    error: err.message,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent')
  });

  next(err);
}
