import { BadgeCheck } from "lucide-react";

// Email lama dan email semu nomor WhatsApp kamu dijadikan syarat centang biru
export const VERIFIED_EMAIL = "bayuraya711@gmail.com";
export const VERIFIED_WHATSAPP_EMAIL = "083109105308@devspace.local";

export function isVerifiedEmail(email?: string | null) {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  
  // Mengembalikan nilai true jika cocok dengan email lama ATAU nomor WA kamu
  return normalizedEmail === VERIFIED_EMAIL || normalizedEmail === VERIFIED_WHATSAPP_EMAIL;
}

export function VerifiedBadge({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      title="Developer terverifikasi"
      className={`inline-flex items-center justify-center text-primary ${className}`}
      style={{
        filter: "drop-shadow(0 0 6px oklch(0.65 0.21 255 / 0.85))",
      }}
    >
      <BadgeCheck size={size} strokeWidth={2.5} fill="currentColor" stroke="#090A0F" />
    </span>
  );
}
