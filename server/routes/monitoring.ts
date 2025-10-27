import { Router, Request, Response, NextFunction } from 'express';
import { Logger } from '../middleware/logger.js';

export const monitoringRouter = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

monitoringRouter.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
    },
    env: process.env.NODE_ENV || 'development'
  });
});

monitoringRouter.get('/api/logs', requireAuth, (req, res) => {
  const logger = Logger.getInstance();
  const limit = parseInt(req.query.limit as string) || 100;
  const type = req.query.type as string;

  let logs;
  if (type === 'errors') {
    logs = logger.getErrorLogs(limit);
  } else {
    logs = logger.getLogs(limit);
  }

  res.json({
    count: logs.length,
    logs
  });
});

monitoringRouter.post('/api/logs/clear', requireAuth, (req, res) => {
  const logger = Logger.getInstance();
  logger.clearLogs();

  res.json({
    success: true,
    message: 'Logs cleared'
  });
});

monitoringRouter.get('/api/metrics', requireAuth, (req, res) => {
  const logger = Logger.getInstance();
  const logs = logger.getLogs(1000);
  
  const errorCount = logs.filter(log => log.statusCode && log.statusCode >= 400).length;
  const avgResponseTime = logs.length > 0
    ? logs
        .filter(log => log.responseTime)
        .reduce((acc, log) => acc + (log.responseTime || 0), 0) / logs.length
    : 0;

  const statusCodes = logs.reduce((acc, log) => {
    if (log.statusCode) {
      const code = Math.floor(log.statusCode / 100) * 100;
      acc[code] = (acc[code] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  res.json({
    period: '1000 últimos requests',
    totalRequests: logs.length,
    errorCount,
    errorRate: logs.length > 0 ? ((errorCount / logs.length) * 100).toFixed(2) + '%' : '0.00%',
    avgResponseTime: Math.round(avgResponseTime) + 'ms',
    statusCodes,
    timestamp: new Date().toISOString()
  });
});
