import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Code2, ArrowLeft, User, Lock, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Autentikasi — DevSpace" },
      { name: "description", content: "Masuk atau daftar akun DevSpace kamu." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // State untuk tukar form Masuk/Daftar
  
  // State Form Input
  const [username, setUsername] = useState("");
  const [nomerHp, setNomerHp] = useState("");
  const [password, setPassword] = useState("");

  // Jika user sudah login, otomatis lempar ke halaman dalam
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active || !data.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .maybeSingle();
      if (!active) return;
      if (!profile?.username) navigate({ to: "/onboarding", replace: true });
      else navigate({ to: "/explore", replace: true });
    })();
    return () => { active = false; };
  }, [navigate]);

  // Fungsi Eksekusi MASUK & DAFTAR
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nomerHp || !password || (isRegister && !username)) {
      toast.error("Mohon isi semua bidang form!");
      return;
    }

    setLoading(true);
    // Trik Email Semu dari Nomor HP
    const emailSemu = `${nomerHp.trim()}@devspace.local`;

    try {
      if (isRegister) {
        // --- PROSES DAFTAR ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: emailSemu,
          password: password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Masukkan username langsung ke tabel profiles agar tidak perlu onboarding lagi
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({ 
              id: authData.user.id, 
              username: username.trim(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error("Gagal menyimpan profil:", profileError);
          }

          toast.success("Pendaftaran berhasil! Selamat datang.");
          navigate({ to: "/explore", replace: true });
        }
      } else {
        // --- PROSES MASUK ---
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: emailSemu,
          password: password,
        });

        if (loginError) throw loginError;

        // Cek kelengkapan username profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", loginData.user!.id)
          .maybeSingle();

        toast.success("Selamat datang kembali di DevSpace!");
        navigate({ to: profile?.username ? "/explore" : "/onboarding", replace: true });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan, periksa data kamu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
      <Link
        to="/"
        className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>

      <div className="glass animate-float-in w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_oklch(0.65_0.21_255_/_0.6)]">
            <Code2 size={26} />
          </div>
          <h1 className="text-2xl font-bold">
            {isRegister ? "Daftar Akun DevSpace" : "Masuk ke DevSpace"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRegister ? "Buat akun barumu dengan mudah dan cepat." : "Bergabung dengan komunitas developer Indonesia."}
          </p>
        </div>

        {/* FORM AUTENTIKASI MANUAL */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Contoh: iboycloud"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nomor HP</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Contoh: 08123456789"
                value={nomerHp}
                onChange={(e) => setNomerHp(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 shadow-[0_0_20px_oklch(0.65_0.21_255_/_0.3)] disabled:opacity-60"
          >
            {loading ? "Memproses..." : isRegister ? "Daftar Sekarang" : "Masuk"}
          </button>
        </form>

        {/* NAVIGASI PINDAH FORM */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          </span>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setUsername("");
            }}
            className="font-medium text-primary hover:underline focus:outline-none"
            disabled={loading}
          >
            {isRegister ? "Masuk di sini" : "Daftar di sini"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Dengan melanjutkan kamu menyetujui ketentuan layanan DevSpace.
        </p>
      </div>
    </div>
  );
}
