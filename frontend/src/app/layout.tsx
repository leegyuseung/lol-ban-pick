import PopupComp from '@/components/Popup';
import './globals.css';
import ClientLayout from '@/layout/ClientLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3412811676948831"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <PopupComp />
      </body>
    </html>
  );
}
