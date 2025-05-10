import './globals.css';
import PopupComp from '@/components/Popup';
import ClientLayout from '@/layout/ClientLayout';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=G-LR8THS5Y4C`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LR8THS5Y4C');
          `}
        </Script>
        {/* Google ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6368269150151357"
          crossOrigin="anonymous"
        ></script>
        {/* naver */}
        <meta name="naver-site-verification" content="82e619b7e36c7f2f1c5ffaebe478276dbbba8000" />
        {/* font */}
        <link
          rel="preload"
          href="/fonts/Pretendard-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <PopupComp />
      </body>
    </html>
  );
}
