import type { Metadata } from "next";
import { DomainPage } from "@/components/DomainPage";

export const metadata: Metadata = { title: "Data Engineering & Science" };

export default function Page() {
  return <DomainPage domainKey="data" />;
}
