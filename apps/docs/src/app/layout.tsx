import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'chadcn - Hyper-dense UI Components',
  description: 'Hyper-dense UI component library for control panels and professional tool interfaces. 28 components, 17 themes.',
  keywords: ['ui components', 'react', 'tailwindcss', 'professional tools', 'photoshop', 'blender', 'control panel'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen" data-theme="photoshop">
        {children}
      </body>
    </html>
  );
}
