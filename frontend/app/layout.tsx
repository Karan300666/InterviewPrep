import type { Metadata } from "next";
import { Mona_Sans, Geist } from "next/font/google";
import "./global.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "InterviewPrep",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "dark", monaSans.className, "font-sans", geist.variable)}
    >
      <body className=" mx-20">
        {children}
      <Toaster/>
      </body>
    </html>
  );
}
