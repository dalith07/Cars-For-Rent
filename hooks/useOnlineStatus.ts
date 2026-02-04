"use client";
import { useEffect } from "react";
import { updateUserStatus } from "@/actions/user/presence";
import { useSession } from "next-auth/react";

export function useOnlineStatus() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user.id) return;

    // Online immediately
    updateUserStatus(session.user.id, true);

    // Ping every 10 seconds to stay online
    const interval = setInterval(() => {
      updateUserStatus(session.user.id, true);
    }, 10000);

    // Offline on close / unload
    const handleUnload = () => {
      updateUserStatus(session.user.id, false);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      updateUserStatus(session.user.id, false);
    };
  }, [session?.user.id]);
}
