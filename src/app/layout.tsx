import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";

import { Toaster } from "@/components/ui/sonner";
import NotificationListener from "@/components/common/NotificationListener";


const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FutureTech",
    template: "FutureTech - %s",
  },
  description:
    "A modern computer shop management system built with Next.js by Muhammad Hashir",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jakartaSans.variable} font-sans antialiased scrollbar-hide scroll-container`}>
        <Toaster />
        <AuthProvider>
          <SocketProvider>
              <NotificationListener />
              {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
