import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Chesterfield Property Management", description: "No leasing fee. Just results. Data-driven property management across KWCG.", icons: [{ rel: "icon", url: "/favicon.ico" }] };
export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="en"><body>{children}</body></html>); }
