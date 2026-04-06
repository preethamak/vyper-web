import type { Metadata } from "next";
import { Exo_2, JetBrains_Mono, Orbitron, Sora, Space_Grotesk } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-alt",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-hero",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vyper Guard • Security Intelligence Interface",
  description:
    "Operational website for Vyper Guard with documentation, detector intelligence, and live project telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${exo2.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-site-gradient font-sans text-slate-900">
        <ToastProvider>
          <div className="relative min-h-screen">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <CommandPalette />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
