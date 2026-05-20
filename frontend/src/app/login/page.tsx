"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

function LoginContent() {
  const router = useRouter();
  const { setAuth, user } = useAuthStore();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const res = await api.post("/auth/google", { token: credentialResponse.credential });
      setAuth(res.data.user, res.data.access_token);
      toast.success(`Bem-vindo, ${res.data.user.name}!`);
      router.push("/dashboard");
    } catch {
      toast.error("Falha no login. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold text-text-primary tracking-tight">
              Crisis<span className="text-brand">Ops</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Bem-vindo</h1>
          <p className="text-text-secondary text-sm">
            Plataforma de governança para comitês de crise
          </p>
        </div>

        {/* Login card */}
        <div className="card p-8">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-text-primary mb-1">Entrar na plataforma</h2>
            <p className="text-text-secondary text-sm">Use sua conta Google corporativa</p>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => toast.error("Erro na autenticação Google")}
              theme="filled_black"
              size="large"
              shape="rectangular"
              text="signin_with"
              locale="pt-BR"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-surface-border text-center">
            <p className="text-xs text-text-muted">
              Acesso restrito a membros autorizados dos comitês de crise.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          © 2024 CrisisOps — Sistema de Governança de Crise
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
