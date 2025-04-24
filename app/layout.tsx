import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from './metadata';
import ClientLayout from './ClientLayout';
import QueryProvider from "@/app/contexts/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
            <ClientLayout>
                {children}
            </ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
