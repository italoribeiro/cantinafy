// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Importando o cliente SSR configurado

/**
 * @description Página de Autenticação (Login).
 * Interface atualizada com o novo template visual e funcionalidade de ocultar/mostrar senha.
 * Responsável por capturar as credenciais do usuário e autenticar via Supabase SSR.
 * 
 * @returns {JSX.Element} A interface interativa de login renderizada.
 */
export default function LoginPage() {
  const router = useRouter();
  
  // ==========================================
  // ESTADOS DO COMPONENTE
  // ==========================================
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Instanciando o cliente Supabase
  const supabase = createClient();

  // ==========================================
  // CONTROLADORES DE EVENTOS (HANDLERS)
  // ==========================================

  /**
   * @description Orquestra a submissão do formulário de login.
   * Aciona o estado de loading e invoca o serviço de autenticação do Supabase.
   * @param {React.FormEvent} e - Evento de submissão do formulário.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Chamada real de autenticação
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error('E-mail ou senha incorretos.');
      }

      // Redireciona para o dashboard após o login bem-sucedido
      router.push('/dashboard');
      
      // Opcional: Para garantir que o layout recarregue o contexto com o novo cookie,
      // em alguns cenários do Next.js App Router, usar router.refresh() antes de router.push() é útil.
      router.refresh(); 

    } catch (error: any) {
      setErrorMsg(error.message || 'Falha ao autenticar. Tente novamente.');
      setIsLoading(false);
    }
  };

  /**
   * @description Alterna a visibilidade do campo de senha (Texto/Password).
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // ==========================================
  // RENDERIZAÇÃO DA INTERFACE (VIEWS)
  // ==========================================
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="text-4xl font-black tracking-tighter mb-2">
            <span className="text-slate-900">cantina</span><span className="text-red-600">fy</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Bem-vindo de volta</h1>
          <p className="text-sm text-slate-500 mt-1">Acesse o painel da sua cantina.</p>
        </div>

        {/* Feedback Visual de Erros */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Campo E-mail */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm font-medium"
              placeholder="seu@email.com"
            />
          </div>

          {/* Campo Senha com Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-slate-700">Senha</label>
              <Link href="/esqueci-minha-senha" className="text-xs font-bold text-red-600 hover:text-red-700">
                Esqueceu a senha?
              </Link>
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm font-medium pr-12"
                placeholder="••••••••"
              />
              
              {/* Botão Ícone de Revelar Senha (Olho) */}
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botão de Submissão */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-70 transition-all shadow-lg shadow-red-600/20"
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Rodapé Direcional */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Ainda não é cliente?{' '}
          <Link href="/cadastro" className="text-red-600 hover:text-red-700 font-bold">
            Teste grátis agora
          </Link>
        </div>

      </div>
    </div>
  );
}