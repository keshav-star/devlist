import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevList - Organize Your YouTube Videos",
  description: "A powerful YouTube playlist manager to organize, track, and manage your video learning journey. Create playlists, add videos, and track your progress with ease.",
  keywords: ["YouTube", "playlist", "manager", "organizer", "video", "learning", "education"],
  authors: [{ name: "Keshav Sandhu" }],
  openGraph: {
    title: "DevList - Organize Your YouTube Videos",
    description: "A powerful YouTube playlist manager to organize, track, and manage your video learning journey.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevList - Organize Your YouTube Videos",
    description: "A powerful YouTube playlist manager to organize, track, and manage your video learning journey.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
