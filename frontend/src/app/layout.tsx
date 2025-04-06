import PopupComp from '@/components/Popup';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <PopupComp />
      </body>
    </html>
  );
}
