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
  metadataBase: new URL("https://demo-invitacion.example"),
  title: "Sofía & Mateo | Invitación Demo",
  description: "Modelo demo de invitación web de casamiento",
  openGraph: {
    title: "Sofía & Mateo | Invitación Demo",
    description: "Modelo demo de invitación web de casamiento",
    url: "https://demo-invitacion.example",
    siteName: "Sofía & Mateo | Invitación Demo",
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
    title: "Sofía & Mateo | Invitación Demo",
    description: "Modelo demo de invitación web de casamiento",
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
