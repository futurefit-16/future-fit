"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) {
          if (!cancelled) {
            setError(
              "Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and restart the dev server.",
            );
          }
          return;
        }
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          if (!cancelled) setError(signOutError.message);
          return;
        }
        router.push("/");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to log out");
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
          <div className="text-lg font-black">Logout failed</div>
          <div className="mt-2 text-sm text-destructive">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-sm text-muted-foreground">Logging you out…</div>
    </div>
  );
}
