import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Tracker Money",
  description: "Tracker Money",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <Navbar />
        <div className="mx-auto w-[70%]">
          {children}
        </div>
      </body>
    </html>
  );
}