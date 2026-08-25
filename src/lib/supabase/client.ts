// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

/**
 * @description Instancia e retorna o cliente do Supabase para ser usado no navegador (Client Components).
 * Utiliza o padrão Singleton (indiretamente via SSR client) para evitar múltiplas conexões.
 * As variáveis de ambiente devem começar com NEXT_PUBLIC_ para serem expostas ao browser.
 * 
 * @returns {SupabaseClient} Instância configurada do Supabase pronta para queries e auth.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}