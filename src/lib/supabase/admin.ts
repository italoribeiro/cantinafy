// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

/**
 * @description Cliente Supabase com privilégios de administrador (Bypassa o RLS).
 * ATENÇÃO: Este arquivo NUNCA deve ser importado em Client Components.
 * Só pode ser usado dentro de Server Actions ou Route Handlers.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);