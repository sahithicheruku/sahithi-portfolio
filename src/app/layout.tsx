import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sahithisri Cheruku | Software Engineer",
  description: "Portfolio of Sahithisri Cheruku, a software engineer and full stack developer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
