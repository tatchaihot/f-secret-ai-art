import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "F-Secret AI Art",
  description: "รับสร้างภาพ AI คุณภาพสูง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased min-h-screen flex flex-col relative">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(222,28%,5%),hsl(222,25%,7%),hsl(220,22%,9%))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,164,80,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(100,116,139,0.06),transparent_40%)]" />
        </div>
        <Providers>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
