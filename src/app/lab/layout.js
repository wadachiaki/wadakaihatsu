// src/app/lab/layout.js
import "../../styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata = {
  title: "wadakaihatsu LAB",
  description: "wadakaihatsuのつくってあそぶ研究室",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="mainContent">{children}</main>
      </body>
    </html>
  );
}
