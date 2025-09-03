import { NextResponse } from "next/server";

export type User = {
    id: number;
    name: string;
    email: string;
};

export async function fetchUsers() {
    try {
      const res = await fetch(`/api/users`, {
        headers: {
          accept: "application/json",
          "X-Group-Authorization": process.env.NEXT_PUBLIC_JEB_API_TOKEN ?? "",
        },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch users (${res.status})`);
      }
  
      const data = await res.json();
      
      // Vérifie que c'est bien un tableau
      if (!Array.isArray(data)) {
        throw new Error("Format de réponse inattendu");
      }
  
      return data; // retourne directement le tableau JSON
    } catch (err) {
      console.error("API route error:", err);
      throw err;
    }
  }
  