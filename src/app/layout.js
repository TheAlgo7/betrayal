import { DM_Sans, JetBrains_Mono, Outfit } from "next/font/google";

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

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL("https://betrayal.thealgothrim.com"),
  title: "Betrayal — Keep your circle real",
  description: "Find out who unfollowed you on Instagram",
  openGraph: {
    title: "Betrayal — Keep your circle real",
    description: "Find out who unfollowed you on Instagram",
    url: "https://betrayal.thealgothrim.com",
    siteName: "Betrayal",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Betrayal — Keep your circle real",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Betrayal — Keep your circle real",
    description: "Find out who unfollowed you on Instagram",
    images: ["/og-image.png"],
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
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${outfit.variable}`}
    >
      <body style={{ margin: 0, padding: 0, background: "#000000" }}>
        {children}
      </body>
    </html>
  );
}
