import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "168 Hours — Weekly Life Tracker",
  description: "Understand where every hour of your week goes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
