"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../../supabaseClient";

type UserRoleContextType = {
  userRole: string | null;
  loading: boolean;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const cachedRole = localStorage.getItem("userRole");
    if (cachedRole) {
      setUserRole(cachedRole);
      setLoading(false);
    }

    async function fetchUserRole() {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        if (isMounted) {
          setUserRole(null);
          setLoading(false);
          localStorage.removeItem("userRole");
        }
        return;
      }

      const { data, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .maybeSingle();

      if (roleError || !data) {
        if (isMounted) {
          setUserRole(null);
          setLoading(false);
          localStorage.removeItem("userRole");
        }
      } else {
        if (isMounted) {
          setUserRole(data.role);
          setLoading(false);
          localStorage.setItem("userRole", data.role);
        }
      }
    }

    fetchUserRole();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUserRole(null);
        localStorage.removeItem("userRole");
      } else {
        supabase
          .from("users")
          .select("role")
          .eq("email", session.user.email)
          .maybeSingle()
          .then(({ data, error }) => {
            if (!error && data) {
              setUserRole(data.role);
              localStorage.setItem("userRole", data.role);
            } else {
              setUserRole(null);
              localStorage.removeItem("userRole");
            }
          });
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserRoleContext.Provider value={{ userRole, loading }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
}