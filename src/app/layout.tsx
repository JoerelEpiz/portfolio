import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Joerel Epiz — Full-Stack Developer",
  description:
    "Portfolio of Joerel Epiz, a full-stack developer crafting fast, delightful web products with Next.js, TypeScript, Tailwind CSS and PostgreSQL.",
  keywords: [
    "Joerel Epiz",
    "portfolio",
    "full-stack developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
    "web development",
  ],
  authors: [{ name: "Joerel Epiz" }],
  openGraph: {
    title: "Joerel Epiz — Full-Stack Developer",
    description:
      "I build fast, delightful products for the web with modern tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joerel Epiz — Full-Stack Developer",
    description: "I build fast, delightful products for the web.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
