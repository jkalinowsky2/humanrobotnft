import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HumanRobot",
  description: "A one-time art drop on ApeChain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
