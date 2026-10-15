import type { ReactNode } from "react";
import { KnowledgeShell } from "@/components/knowledge/knowledge-shell";
export default function KnowledgeLayout({children}:{children:ReactNode}) { return <KnowledgeShell>{children}</KnowledgeShell>; }
