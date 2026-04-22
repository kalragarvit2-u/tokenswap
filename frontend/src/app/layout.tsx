import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import LiveFeed from "@/components/LiveFeed";

import { BlockchainProvider } from "@/context/BlockchainContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token Swap | Decentralized Exchange",
  description: "Swap tokens on the blockchain with Soroban smart contracts",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <BlockchainProvider>
          {children}
          <LiveFeed />
          <Toaster richColors position="top-right" />
        </BlockchainProvider>
      </body>
    </html>
  );
}
