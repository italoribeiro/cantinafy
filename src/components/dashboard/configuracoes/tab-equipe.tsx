// src/components/dashboard/configuracoes/tab-equipe.tsx
'use client';

import { useTenant } from '@/core/contexts/tenant-context';

/**
 * @component TabEquipe
 * @description Submódulo de gestão de recursos humanos (RBAC) isolado por Tenant.
 * Lista os funcionários ativos e avalia as regras de negócio do SaaS contratado para 
 * liberar ou bloquear a inserção de novos usuários na plataforma.
 * 
 * @returns {JSX.Element | null} Painel de controle de acesso de usuários.
 */
export default function TabEquipe() {
  const { session } = useTenant();

  if (!session) return null;

  // ==========================================
  // REGRA DE NEGÓCIO: LIMITES DO LICENCIAMENTO
  // ==========================================
  // Mockamos a contagem atual de usuários como 1 (apenas o dono logado).
  // Em produção, isso seria um count() na tabela 'perfis_usuarios'.
  const currentUsersCount = 1; 
  const canAddUser = session.limite_usuarios > currentUsersCount;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 space-y-6">
      
      {/* Cabeçalho e Gatilho Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Gestão de Usuários</h3>
          <p className="text-sm text-slate-500 mt-1">Controle o acesso dos seus caixas, cozinheiros e gerentes.</p>
        </div>
        
        {/* Botão Dinâmico (Travado ou Liberado pelo Banco) */}
        <button 
          disabled={!canAddUser}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex-shrink-0 ${
            canAddUser 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
          title={!canAddUser ? "Limite do plano atingido. Faça upgrade." : "Convidar novo funcionário"}
        >
          + Adicionar Usuário
        </button>
      </div>

      {/* Componente Visual de Upsell (Disparado quando a cota esgota) */}
      {!canAddUser && (
        <div className="p-5 bg-orange-50 border border-orange-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-orange-800 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Limite de Usuários Atingido
            </h4>
            <p className="text-xs text-orange-600 mt-1 font-medium">
              Seu plano atual ({session.plano_atual.toUpperCase()}) permite apenas {session.limite_usuarios} acesso(s). 
              Faça o upgrade da sua assinatura para escalar sua equipe.
            </p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap">
            Fazer Upgrade
          </button>
        </div>
      )}

      {/* Tabela de Listagem de Funcionários (RBAC) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Cargo / Perfil</th>
                <th className="px-6 py-4">Filial Restrita</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Linha mockada do Administrador (Baseada na Sessão Atual) */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-50 border border-red-100 text-red-600 font-black flex items-center justify-center text-xs">
                      {session.iniciais}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{session.nome_usuario}</p>
                      <p className="text-xs text-slate-500 font-medium">{session.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {session.perfil_nome}
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">
                  Todas (Acesso Global)
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Ativo</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded">Conta Master</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}