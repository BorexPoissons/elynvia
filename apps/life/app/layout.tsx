import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELYNVIA Life — Your Life. Your Agent.",
  description: "From intention to action. ELYNVIA understands what you want to accomplish and helps you move it forward.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
