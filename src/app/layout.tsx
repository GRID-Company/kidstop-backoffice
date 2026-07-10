import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import Providers from '@/shared/providers/providers';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kidstop',
  description: 'Backoffice de Kidstop',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value ?? '';
  const jwt = cookieStore.get('jwt')?.value ?? null;

  return (
    <html lang='es-MX'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers role={role} jwt={jwt}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
