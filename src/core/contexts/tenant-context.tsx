// src/core/contexts/tenant-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

/**
 * @description Inicialização do Cliente Supabase Nativo para o Front-End (Client-Side).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Filial {
  id: string;
  nome: string;
  is_matriz: boolean;
}

export interface TenantSession {
  usuario_id: string;
  email: string;
  nome_usuario: string;
  iniciais: string; 
  tenant_id: string;
  nome_fantasia: string;
  plano_atual: string;
  limite_usuarios: number;
  perfil_id: string;
  perfil_nome: string; 
  filial_ativa_id: string;
  filiais_disponiveis: Filial[];
}

interface TenantContextType {
  session: TenantSession | null;
  isLoading: boolean;
  mudarFilialAtiva: (filial_id: string) => void;
  logout: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<TenantSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    async function loadSessionData() {
      try {
        // 1. Verifica identidade (Sessão Local do Navegador)
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        // CORREÇÃO: Redirecionamento suave sem disparar 'throw' para o Next.js
        if (authError || !authData.user) {
          console.warn('Sem sessão ativa. Redirecionando para login...');
          router.push('/login');
          return; // Encerra a execução da função aqui
        }

        const userId = authData.user.id;
        const email = authData.user.email || '';

        // 2. Busca o vínculo do usuário com a Cantina (Tenant)
        const { data: perfilData, error: perfilError } = await supabase
          .from('perfis_usuarios')
          .select(`
            nome, tenant_id, filial_id, perfil_id,
            tenants ( nome_fantasia, plano_atual, limite_usuarios ),
            perfis ( nome )
          `)
          .eq('id', userId)
          .single();

        // CORREÇÃO: Evita crash caso o perfil ainda não tenha sido finalizado
        if (perfilError || !perfilData) {
          console.warn('Perfil incompleto. Redirecionando...');
          router.push('/login');
          return;
        }

        // 3. Busca a lista de filiais
        const { data: filiaisData } = await supabase
          .from('filiais')
          .select('id, nome, is_matriz')
          .eq('tenant_id', perfilData.tenant_id)
          .order('is_matriz', { ascending: false });

        // 4. Transformação Visual (Iniciais)
        const iniciais = perfilData.nome
          .split(' ')
          .map((n: string) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        // 5. Consolidação
        setSession({
          usuario_id: userId,
          email: email,
          nome_usuario: perfilData.nome,
          iniciais: iniciais,
          tenant_id: perfilData.tenant_id,
          nome_fantasia: (perfilData.tenants as any).nome_fantasia,
          plano_atual: (perfilData.tenants as any).plano_atual,
          limite_usuarios: (perfilData.tenants as any).limite_usuarios,
          perfil_id: perfilData.perfil_id,
          perfil_nome: (perfilData.perfis as any).nome,
          filial_ativa_id: perfilData.filial_id || (filiaisData && filiaisData[0]?.id),
          filiais_disponiveis: filiaisData || [],
        });

      } catch (error) {
        console.error('Erro inesperado na sessão:', error);
        router.push('/login');
      } finally {
        setIsLoading(false); // Libera a tela de bloqueio
      }
    }

    loadSessionData();
  }, [router]);

  const mudarFilialAtiva = (filial_id: string) => {
    if (session) {
      setSession({ ...session, filial_ativa_id: filial_id });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push('/login');
  };

  return (
    <TenantContext.Provider value={{ session, isLoading, mudarFilialAtiva, logout }}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">
          Carregando ambiente operacional...
        </div>
      ) : (
        children
      )}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant deve ser utilizado dentro de um <TenantProvider>');
  }
  return context;
}