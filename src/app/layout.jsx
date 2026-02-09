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
  metadataBase: new URL("https://kcc.ssru.ac.th"),
  title: "วารสารแก้วเจ้าจอมออนไลน์",
  description:
    "เว็บไซต์ข่าวแห่งนี้เป็นหนึ่งในช่องทางการสื่อสารของมหาวิทยาลัยราชภัฏสวนสุนันทา มุ่งมั่นนำเสนอข่าวสารและเรื่องราวที่น่าสนใจด้วยความรับผิดชอบต่อสังคม โดยยึดหลักความถูกต้อง ทันสมัย และเหมาะสมต่อบริบทของสังคมไทย กองบรรณาธิการให้ความสำคัญกับการนำเสนอข้อมูลอย่างสร้างสรรค์ รอบด้าน และคำนึงถึงจริยธรรมด้านการสื่อสาร เพื่อทำหน้าที่เป็นสื่อกลางในการถ่ายทอดข้อมูลข่าวสาร เสริมสร้างความเข้าใจ และสร้างการรับรู้ร่วมกันในสังคมอย่างยั่งยืน",
  icons: {
    icon: "/assets/images/logo_new.png",
    shortcut: "/assets/images/logo_new.png",
    apple: "/assets/images/logo_new.png",
  },
  alternates: {
    canonical: "/",
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
