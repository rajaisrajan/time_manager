import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800","900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "168 Hours — Weekly Life Tracker",
  description: "Understand where every hour of your week goes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
