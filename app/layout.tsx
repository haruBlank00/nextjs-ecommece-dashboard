import { ModalProvider } from "@/providers/modal-providers";

import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import prismadb from "@/lib/prisma.db";
import { ToastProvider } from "@/providers/toast-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Admin dashboard for blank commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = prismadb.store.findMany();
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
