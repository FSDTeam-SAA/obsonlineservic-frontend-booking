import type { Metadata } from "next";
import { DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/page-loader";
import { SmoothScroll } from "@/components/smooth-scroll";
import Provider from "@/Providers/Provider";
import MainProviders from "@/Providers/MainProviders";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking Is Yours",
  description: "Premium holiday parks and retreats across Europe.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={ cn("h-full",  "antialiased", dmSans.variable, "font-sans", geist.variable) }
      >
      <body className="min-h-full flex flex-col bg-[#F8F9FC]">
        <Provider>
          <MainProviders>
            <PageLoader />
            <SmoothScroll>{children}</SmoothScroll>
          </MainProviders>
        </Provider>
      </body>
    </html>
  );
}
