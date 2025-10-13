import { createDatabaseConnection, getDatabaseStatus, dbConfig } from './database-config';

export const db = createDatabaseConnection();

export { getDatabaseStatus, dbConfig };
