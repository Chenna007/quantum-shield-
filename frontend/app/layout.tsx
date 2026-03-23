import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'QuantumShield — Securing the Internet for the Quantum Era',
  description: 'Detect cryptography vulnerable to future quantum attacks. Protect your organization before the threat arrives.',
  keywords: 'quantum security, post-quantum cryptography, TLS scanner, PQC, NIST, cybersecurity',
  openGraph: {
    title: 'QuantumShield',
    description: 'Quantum cryptography risk assessment platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B0F1A] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
