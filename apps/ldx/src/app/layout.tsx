import type { Metadata } from 'next';

import { AppToaster } from '@/components/shared/toaster';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ldx.example.com'),
  title: {
    default: 'LXD4DL Architect',
    template: '%s | LXD4DL Architect',
  },
  description: 'Plataforma de diseno instruccional asistida por IA',
  openGraph: {
    title: 'LXD4DL Architect',
    description: 'Plataforma de diseno instruccional asistida por IA',
    images: ['/icon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
