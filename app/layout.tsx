import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LearnForge — Turn an idea into a project. Turn a project into skills.",
  description: "AI-powered project-building mentor for beginner and intermediate developers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
