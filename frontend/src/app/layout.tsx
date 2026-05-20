import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CrisisOps — Governança de Comitês de Crise",
  description: "Sistema de governança para comitês de gestão de crise",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E2535",
              color: "#F0F4FF",
              border: "1px solid #2A3347",
            },
          }}
        />
      </body>
    </html>
  );
}
