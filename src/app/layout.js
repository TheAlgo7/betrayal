import { DM_Sans, JetBrains_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["600", "700", "900"],
});

export const metadata = {
  metadataBase: new URL("https://betrayal-seven.vercel.app"),
  title: "Betrayal: Keep your circle real",
  description: "Find out who unfollowed you on Instagram",
  openGraph: {
    title: "Betrayal: Keep your circle real",
    description: "Find out who unfollowed you on Instagram",
    url: "https://betrayal-seven.vercel.app",
    siteName: "Betrayal",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Betrayal: Keep your circle real",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Betrayal: Keep your circle real",
    description: "Find out who unfollowed you on Instagram",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/favicon.ico" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Betrayal",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a0d1a" },
    { media: "(prefers-color-scheme: light)", color: "#f9f2f9" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable}`}
    >
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
