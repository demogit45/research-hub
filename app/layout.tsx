import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Group Hub — Research Workspace",
  description: "One page for every link, doc, and repo our research group uses. Connected live to Supabase.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e0a458' stroke-width='1.6'%3E%3Cpath d='M12 3.5 20 8v8L12 20.5 4 16V8z'/%3E%3Cpath d='M12 12 12 3.5M12 12 4 8M12 12 20 8M12 12 4 16M12 12 20 16M12 12 12 20.5'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body>
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
