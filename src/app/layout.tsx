import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Agreement Form — Digital Signing',
  description:
    'Complete and digitally sign your student agreement form. Read the full agreement, provide your details, and submit your signature securely.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
