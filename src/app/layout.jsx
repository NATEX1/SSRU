import { Inter, Kanit } from "next/font/google";
import "./globals.css";
import SessionProvider from '@/components/session-provider'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata = {
  title: "SSRU - เว็บไซต์วารสารแก้วเจ้าจอมออนไลน์",
  description:
    "คณะกรรมการกำหนดทิศทางยุทธศาสตร์ในการสื่อสารองค์กรมหาวิทยาลัยราชภัฏสวนสุนันทา",
  icons: {
    icon: "/assets/images/logo_new.png", 
    shortcut: "/assets/images/logo_new.png",
    apple: "/assets/images/logo_new.png",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" data-theme="light">
      <body
        className={`
          ${inter.variable}
          ${kanit.variable}
          antialiased bg-white text-black
        `}
        style={{
          fontFamily: "var(--font-inter), var(--font-kanit), sans-serif",
        }}
      >
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
