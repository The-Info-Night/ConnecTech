"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

type UserRoleContextType = {
  role: string | null;
  setRole: (role: string | null) => void;
};

const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  setRole: () => {}
});

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }}) => {
      setRole(user?.user_metadata?.role || null);
    });
  }, []);
  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext).role;
}
