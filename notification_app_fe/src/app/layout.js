import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'Campus Notifications Platform',
  description: 'Real-time updates for Placements, Events, and Results',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
