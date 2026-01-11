import { Inter, Kanit } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "sonner";
import Script from "next/script";
import GAPageView from "@/components/ga-pageview";

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
  url: "https://kcc.ssru.ac.th",
  title: "วารสารแก้วเจ้าจอมออนไลน์",
  description:
    "คณะกรรมการกำหนดทิศทางยุทธศาสตร์ในการสื่อสารองค์กรมหาวิทยาลัยราชภัฏสวนสุนันทา",
  icons: {
    icon: "/assets/images/logo_new.png",
    shortcut: "/assets/images/logo_new.png",
    apple: "/assets/images/logo_new.png",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" data-theme="light">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
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
          <Toaster position="top-right" expand={true} richColors />
          <GAPageView />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
