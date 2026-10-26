import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/config/site";
import { Logo } from "./ui";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory text-obsidian">
      <header className="border-b border-obsidian/10 bg-obsidian text-ivory">
        <div className="container-lux flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={40} />
            <span className="font-serif text-xl">
              Wedding Cars<span className="text-gold">.Lux</span>
            </span>
          </Link>
          <Link href="/" className="link-lux text-ivory/80">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Home
          </Link>
        </div>
      </header>
      <main className="container-lux max-w-3xl py-20">
        <p className="eyebrow text-gold-ink">{site.name}</p>
        <h1 className="display mt-4 text-5xl md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-obsidian/50">Last updated {updated}</p>
        <div className="mt-12 space-y-6 leading-relaxed text-obsidian/80 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-obsidian [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </main>
    </div>
  );
}
