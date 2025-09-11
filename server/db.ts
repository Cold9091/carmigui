// Sistema de banco de dados flexível - suporta SQLite, PostgreSQL (Neon), e Supabase
import { createDatabaseConnection, getDatabaseStatus, dbConfig } from './database-config';

// Exportar conexão do banco de dados
export const db = createDatabaseConnection();

// Exportar status e configuração para uso na administração
export { getDatabaseStatus, dbConfig };

// Para compatibilidade com integrações futuras do Supabase
export let supabase: any = null;

// Inicializar cliente Supabase se configurado
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    // Nota: A integração completa do Supabase será configurada via blueprint
    console.log('Supabase configurado - URL:', process.env.SUPABASE_URL);
  } catch (error) {
    console.warn('Erro ao inicializar Supabase:', error);
  }
}