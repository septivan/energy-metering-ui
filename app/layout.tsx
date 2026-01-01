import './globals.css';
import type { Metadata } from 'next';
import NavigationProgress from '@/components/common/NavigationProgress';
import Navigation from '@/components/common/Navigation';

export const metadata: Metadata = {
  title: 'Energy Metering Dashboard',
  description: 'Real-time IoT energy metering system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationProgress />
        <div className="layout">
          <Navigation />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
