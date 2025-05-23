import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { auth } from "@/auth";
import { HotjarInitialiser } from "@/components/HotjarInitialiser";
import { ChatProvider } from "@/contexts/ChatContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatGPT for SGExams",
  description: "Enriching ChatGPT with the knowledge of the SGExams community",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <ChatProvider>{children}</ChatProvider>
        </AuthProvider>

        <HotjarInitialiser />
      </body>
    </html>
  );
}
