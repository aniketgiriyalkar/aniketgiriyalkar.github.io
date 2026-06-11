import type { Metadata } from "next";
import { DomainPage } from "@/components/DomainPage";

export const metadata: Metadata = { title: "App Development" };

export default function Page() {
  return <DomainPage domainKey="app-development" />;
}
