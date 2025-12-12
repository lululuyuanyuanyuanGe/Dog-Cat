import type { Metadata } from "next";
import { Outfit, Gloria_Hallelujah, JetBrains_Mono, Nanum_Pen_Script } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

// Font configuration
const clashDisplay = localFont({
  src: '../fonts/ClashDisplay-Variable.woff2',
  variable: '--font-clash-display',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const gloriaHallelujah = Gloria_Hallelujah({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloria-hallelujah",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const nanumPenScript = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nanum-pen-script",
});

export const metadata: Metadata = {
  title: "Hazel & Orange",
  description: "Sweet home for Luyuan & Claire!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${clashDisplay.variable} ${outfit.variable} ${gloriaHallelujah.variable} ${jetbrainsMono.variable} ${nanumPenScript.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


