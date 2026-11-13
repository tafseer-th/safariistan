import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["italic", "normal"],
  variable: "--font-display",
});

export const metadata = {
  title: "Safaristan – Pakistan Tour Packages 2026 & 2027",
  description:
    "Safaristan: private and family tour packages for Hunza, Skardu, Naran Kaghan and more. Hotels, rent a car and sightseeing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${poppins.className} ${playfair.variable}`} suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
        <FloatingContactButtons />
      </body>
    </html>
  );
}