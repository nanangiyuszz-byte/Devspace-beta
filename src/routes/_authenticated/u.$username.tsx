import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";

export const Route = createFileRoute("/_authenticated/u/$username")({
  head: ({ params }) => ({ meta: [{ title: `@${params.username} — DevSpace` }] }),
  component: ProfilePlaceholder,
});

function ProfilePlaceholder() {
  const { username } = Route.useParams();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <Link to="/explore" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft size={13} /> Kembali ke Jelajah
        </Link>
        <div className="glass animate-float-in rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-bold">@{username}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Halaman profil lengkap akan tersedia di iterasi berikutnya:
            statistik posting, followers, following, total suka, tombol Ikuti,
            grid project, dan Pengaturan profil.
          </p>
        </div>
      </main>
    </div>
  );
}
