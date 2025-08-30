// TODO: Configuração da base de dados removida temporariamente
// Para integrar com Supabase no futuro, descomentar e modificar este arquivo

/*
// === EXEMPLO PARA INTEGRAÇÃO FUTURA COM SUPABASE ===

import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase (será necessário adicionar as variáveis de ambiente)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Depois criar uma SupabaseStorage class em storage.ts que implementa IStorage
// e usar supabase.from('table_name') para as operações CRUD

*/

// === CONFIGURAÇÃO POSTGRESQL ORIGINAL (COMENTADA) ===
/*
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
*/