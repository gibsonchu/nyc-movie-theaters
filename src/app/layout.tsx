import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "Thank You for Coming to the Movies",
  description:
    "An editorial map of New York City's movie theaters, from the first public film screening in 1896 to today.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${archivo.variable}`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
