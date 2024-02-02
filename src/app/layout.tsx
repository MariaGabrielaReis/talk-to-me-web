import { SocketProvider } from "@/contexts/SocketContext";
import type { Metadata } from "next";
import { Delius } from "next/font/google";
import "./globals.css";

const delius = Delius({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talk to Me!",
  description: "Plataforma de chamadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${delius.className} bg-black text-white`}>
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
