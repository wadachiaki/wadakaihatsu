// src/app/layout.js
import "../styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from '../components/ClientLayout';

export const metadata = {
  title: "OISHII CLUB LAB",
  description: "OISHII CLUBのつくってあそぶ研究室",
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
