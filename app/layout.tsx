import type { Metadata } from "next";
import {benton} from "./fonts";
import "./globals.css";

import { CustomisationProvider } from "@/contexts/customisation";

export const metadata: Metadata = {
  title: "Design your lift | Aussie Lifts",
  description: "Total control and customisation to make your lift truly your own with Aussie Lifts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomisationProvider>
      <html lang="en">
      <meta name="viewport" content="initial-scale=1, width=device-width" />
        <body className={benton.className}>
        <div id="smooth-wrapper">
          <div id="smooth-content">
              {children}
            </div>
          </div>
        </body>
      </html>
    </CustomisationProvider>
  );
}