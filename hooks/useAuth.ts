"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Member } from "@/types";
import { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [supabase] = useState(() => createBrowserClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMemberProfile = useCallback(
    async (userId: string, userEmail?: string, userMetadata?: Record<string, any>) => {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (data) {
          setMember(data as Member);
          return data as Member;
        }

        // If not yet inserted in public.members, reconstruct from user_metadata
        if (userMetadata && userEmail) {
          const fallbackMember: Member = {
            id: userId,
            name: userMetadata.name || userEmail.split("@")[0],
            role: userMetadata.role || "Researcher",
            department: userMetadata.department || "research",
            email: userEmail,
            github: userMetadata.github || "",
            is_admin: Boolean(userMetadata.is_admin),
            member_code: userMetadata.member_code || `RES-${userId.slice(0, 5).toUpperCase()}`,
          };
          setMember(fallbackMember);
          return fallbackMember;
        }
      } catch (err) {
        console.warn("Could not fetch member profile:", err);
      }
      return null;
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await fetchMemberProfile(
            initialSession.user.id,
            initialSession.user.email,
            initialSession.user.user_metadata
          );
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchMemberProfile(
          currentSession.user.id,
          currentSession.user.email,
          currentSession.user.user_metadata
        );
      } else {
        setMember(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchMemberProfile]);

  const signIn = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      let email = identifier.trim();

      // If user typed a Member ID / Code (e.g. RES-XXXX or DIYA-9M2X) instead of email,
      // resolve email from public.members first
      if (!email.includes("@")) {
        const { data: matchedMember } = await supabase
          .from("members")
          .select("email")
          .or(`member_code.eq.${email},id.eq.${email}`)
          .maybeSingle();

        if (matchedMember?.email) {
          email = matchedMember.email;
        } else {
          // If admin code shortcut
          if (email.toLowerCase() === "admin") {
            email = "admin@hub.internal";
          } else {
            throw new Error(`No member registered with code "${identifier}". Try using your email.`);
          }
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { user: data.user, session: data.session };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (payload: {
    email: string;
    password: string;
    name: string;
    department: string;
    role?: string;
    github?: string;
    isAdmin?: boolean;
  }) => {
    setLoading(true);
    try {
      const memberCode = `RES-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // 1. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: payload.email.trim(),
        password: payload.password,
        options: {
          data: {
            name: payload.name.trim(),
            department: payload.department,
            role: payload.role?.trim() || "Researcher",
            github: payload.github?.trim() || "",
            is_admin: Boolean(payload.isAdmin),
            member_code: memberCode,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user returned from signup.");

      const newMember: Member = {
        id: data.user.id,
        name: payload.name.trim(),
        role: payload.role?.trim() || "Researcher",
        department: payload.department,
        email: payload.email.trim(),
        github: payload.github?.trim() || "",
        is_admin: Boolean(payload.isAdmin),
        member_code: memberCode,
      };

      // 2. Synchronize to public.members table
      const { error: profileError } = await supabase.from("members").upsert(newMember);

      if (profileError) {
        console.warn("Notice: public.members upsert:", profileError.message);
      }

      setMember(newMember);
      return { user: data.user, member: newMember };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = Boolean(member?.is_admin || user?.user_metadata?.is_admin);

  return {
    supabase,
    user,
    session,
    member,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
