// src/core/contexts/tenant-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // <-- Alterado para o client que lê Cookies
import { useRouter } from 'next/navigation';

/**
 * @description Inicialização do Cliente Supabase preparado para ler os Cookies do Next.js
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

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
      console.log('🔄 [TenantContext] Iniciando carregamento da sessão...');
      try {
        // 1. Verifica Auth usando os Cookies Seguros via @supabase/ssr
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authData.user) {
          console.warn('❌ [TenantContext] Sem sessão no Auth. Redirecionando...', authError);
          router.push('/login');
          return;
        }

        const userId = authData.user.id;
        const email = authData.user.email || '';
        console.log(`✅ [TenantContext] Usuário Auth detectado: ${email} (ID: ${userId})`);

        // 2. Busca Perfil e Relacionamentos
        console.log('⏳ [TenantContext] Buscando dados no banco (perfis_usuarios + tenants)...');
        const { data: perfilData, error: perfilError } = await supabase
          .from('perfis_usuarios')
          .select(`
            nome, tenant_id, filial_id, perfil_id,
            tenants ( nome_fantasia, plano_atual, limite_usuarios ),
            perfis ( nome )
          `)
          .eq('id', userId)
          .single();

        if (perfilError) {
          console.error('❌ [TenantContext] ERRO SQL ao buscar perfil:', perfilError);
          router.push('/login');
          return;
        }

        if (!perfilData) {
          console.error('❌ [TenantContext] PERFIL NÃO ENCONTRADO no banco para o ID:', userId);
          router.push('/login');
          return;
        }

        console.log('✅ [TenantContext] Dados do banco retornados com sucesso:', perfilData);

        // Verifica se as colunas novas do SaaS estão quebrando
        const tenantsInfo = perfilData.tenants as any;
        if (tenantsInfo.limite_usuarios === null || tenantsInfo.limite_usuarios === undefined) {
          console.warn('⚠️ [TenantContext] ALERTA: limite_usuarios está NULO na tabela tenants. Isso pode quebrar a UI.');
        }

        // 3. Busca Filiais
        console.log('⏳ [TenantContext] Buscando filiais da cantina...');
        const { data: filiaisData, error: filiaisError } = await supabase
          .from('filiais')
          .select('id, nome, is_matriz')
          .eq('tenant_id', perfilData.tenant_id)
          .order('is_matriz', { ascending: false });

        if (filiaisError) {
          console.error('❌ [TenantContext] ERRO SQL ao buscar filiais:', filiaisError);
        }

        console.log(`✅ [TenantContext] ${filiaisData?.length || 0} filiais encontradas.`);

        // 4. Transformação Visual
        const iniciais = perfilData.nome
          .split(' ')
          .map((n: string) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        // 5. Monta Sessão
        setSession({
          usuario_id: userId,
          email: email,
          nome_usuario: perfilData.nome,
          iniciais: iniciais,
          tenant_id: perfilData.tenant_id,
          nome_fantasia: tenantsInfo.nome_fantasia,
          plano_atual: tenantsInfo.plano_atual,
          limite_usuarios: tenantsInfo.limite_usuarios,
          perfil_id: perfilData.perfil_id,
          perfil_nome: (perfilData.perfis as any).nome,
          filial_ativa_id: perfilData.filial_id || (filiaisData && filiaisData[0]?.id),
          filiais_disponiveis: filiaisData || [],
        });
        
        console.log('🎉 [TenantContext] Sessão montada e liberada para o Dashboard!');

      } catch (error) {
        console.error('🚨 [TenantContext] ERRO CRÍTICO TRY/CATCH:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
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