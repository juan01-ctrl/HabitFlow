import type { Metadata } from "next";
import localFont         from "next/font/local";
import "../globals.css";
import { Toaster }       from "react-hot-toast";

import { getSession } from "./api/auth/[...nextauth]/options";
import Navbar         from "./components/Navbar";
import { Providers }  from "./providers";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HabitFlow",
  description: "An app to track your habits",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>
          <Navbar />
          <div className="max-w-[1024px] mx-auto">
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
