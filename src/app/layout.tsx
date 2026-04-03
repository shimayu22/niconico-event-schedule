import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "投稿祭スケジュール（非公式）",
  description: "車載動画寄りの投稿祭スケジュール掲載（仮）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
