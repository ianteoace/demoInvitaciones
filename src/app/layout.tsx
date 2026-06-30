import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = localFont({
  variable: "--font-cormorant",
  src: "./fonts/Recia-MediumItalic.woff",
  weight: "500",
  style: "italic",
});

const reciaRegular = localFont({
  variable: "--font-recia-regular",
  src: "./fonts/Recia-Regular.otf",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://manuyruthi.up.railway.app"),
  title: "Manu & Ruth | Invitación",
  description: "Invitación web de casamiento para Manu y Ruth",
  openGraph: {
    title: "Manu & Ruth | Invitación",
    description: "Invitación web de casamiento para Manu y Ruth",
    url: "https://manuyruthi.up.railway.app",
    siteName: "Manu & Ruth | Invitación",
    images: [
      {
        url: "/hero/pareja.jpg",
      },
    ],
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manu & Ruth | Invitación",
    description: "Invitación web de casamiento para Manu y Ruth",
    images: ["/hero/pareja.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${reciaRegular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
