import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-obsidian px-6 text-center">
      <div>
        <p className="eyebrow text-gold">404</p>
        <h1 className="display mt-4 text-5xl md:text-7xl">
          A wrong <em className="italic text-gold-soft">turn</em>.
        </h1>
        <p className="mt-6 text-ivory/60">The page you were looking for isn&apos;t here.</p>
        <Link href="/" className="btn btn-gold mt-10">Return home</Link>
      </div>
    </main>
  );
}
