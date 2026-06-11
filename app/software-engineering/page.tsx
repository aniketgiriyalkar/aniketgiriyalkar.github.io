import type { Metadata } from "next";
import { DomainPage } from "@/components/DomainPage";

export const metadata: Metadata = { title: "Software Engineering" };

export default function Page() {
  return <DomainPage domainKey="software-engineering" />;
}
