import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { auth } from "@/auth";
import { HotjarInitialiser } from "@/components/HotjarInitialiser";
import { ChatProvider } from "@/contexts/ChatContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={session}>
            <ChatProvider>
              <SidebarProvider
                style={
                  {
                    // adapted from: https://ui.shadcn.com/blocks (app/dashboard/page.tsx)
                    "--header-height": "calc(var(--spacing) * 12)",
                  } as React.CSSProperties
                }
              >
                <AppSidebar />
                {children}
              </SidebarProvider>
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>

        <HotjarInitialiser />
      </body>
    </html>
  );
}
