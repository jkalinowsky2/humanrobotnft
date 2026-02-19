import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";


export const metadata: Metadata = {
  title: "HumanRobot",
  description: "A one-time art drop on ApeChain.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>

    </html>
  );
}
