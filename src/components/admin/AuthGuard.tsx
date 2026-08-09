"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session) {
        setAuthed(true);
        setChecked(true);
      } else {
        router.replace("/login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) {
        setAuthed(false);
        router.replace("/login");
      } else {
        setAuthed(true);
        setChecked(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (!checked || !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Verificando sesión...</p>
      </div>
    );
  }

  return <>{children}</>;
}
