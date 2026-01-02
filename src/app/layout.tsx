import type { Metadata } from 'next';
import { Nunito, Roboto } from 'next/font/google';
import '@/styles/main.scss';
import ClientProviders from '@/components/ClientProviders';

// Configure Google Fonts
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-nunito',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'QR Code Manager',
  description: 'Manage and redirect your dynamic QR codes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${roboto.variable}`}>
      <body className={nunito.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
