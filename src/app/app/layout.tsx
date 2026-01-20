import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
