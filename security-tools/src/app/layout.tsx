import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Security Tools Hub - Comprehensive Cybersecurity Tools",
  description: "Access a collection of security assessment tools including Security Assessor, Password Game, Phishing Email Assessor, and Secure Website Assessor.",
  keywords: "security tools, cybersecurity, password game, phishing detection, website security, vulnerability assessment",
  authors: [{ name: "Security Tools Hub" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
