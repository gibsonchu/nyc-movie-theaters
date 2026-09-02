import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reel City — A History of New York's Movie Theaters",
  description:
    "An editorial map of New York City's movie theaters, from the first public film screening in 1896 to today.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
