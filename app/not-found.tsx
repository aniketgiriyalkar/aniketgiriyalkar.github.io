import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found shell">
      <p className="eyebrow">404 / Route not found</p>
      <h1>This path has not been built yet.</h1>
      <Link className="button primary" href="/">Return home</Link>
    </main>
  );
}
