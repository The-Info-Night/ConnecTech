"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";

export type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  uuid: string;
  role?: string;
};

export type Conversation = {
  user: User;
  lastMessage: Message | null;
};

export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser({
          id: data.user.id,
          name: data.user.email || "Me",
          uuid: data.user.id,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("users").select("id, name, uuid, role, email");
      if (!error && data) {
        setUsers(
          data.map((u) => ({
            id: u.id.toString(),
            name: u.name || u.email || `User ${u.id}`,
            uuid: u.uuid,
            role: u.role,
          }))
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUser.uuid},receiver_id.eq.${currentUser.uuid}`)
        .order("created_at", { ascending: false });
      if (data && !error) {
        const map: Record<string, Conversation> = {};
        data.forEach((msg) => {
          const partnerUuid =
            msg.sender_id === currentUser.uuid ? msg.receiver_id : msg.sender_id;
          if (!map[partnerUuid]) {
            const user =
              users.find((u) => u.uuid === partnerUuid) || {
                id: partnerUuid,
                name: `User ${partnerUuid}`,
                uuid: partnerUuid,
              };
            map[partnerUuid] = { user, lastMessage: msg };
          }
        });
        setConversations(
          Object.values(map).sort(
            (a, b) =>
              b.lastMessage!.created_at.localeCompare(a.lastMessage!.created_at) || 0
          )
        );
      }
    })();
  }, [currentUser, users]);

  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setMessages([]);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.uuid},receiver_id.eq.${selectedUser.uuid}),and(sender_id.eq.${selectedUser.uuid},receiver_id.eq.${currentUser.uuid})`
        )
        .order("created_at", { ascending: true });
      if (data && !error) setMessages(data);
    })();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (!currentUser) return;
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (
            selectedUser &&
            ((msg.sender_id === currentUser.uuid &&
              msg.receiver_id === selectedUser.uuid) ||
              (msg.sender_id === selectedUser.uuid &&
                msg.receiver_id === currentUser.uuid))
          ) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === (msg as any).id)) return prev;
              return [...prev, msg];
            });
          }
          setConversations((prev) => {
            const partnerUuid =
              msg.sender_id === currentUser.uuid ? msg.receiver_id : msg.sender_id;
            const idx = prev.findIndex((c) => c.user.uuid === partnerUuid);
            const user =
              users.find((u) => u.uuid === partnerUuid) || {
                id: partnerUuid,
                name: `User ${partnerUuid}`,
                uuid: partnerUuid,
              };
            const newConv = { user, lastMessage: msg };
            if (idx === -1) return [newConv, ...prev];
            const copy = [...prev];
            copy.splice(idx, 1);
            return [newConv, ...copy];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser, selectedUser, users]);

  const sendMessage = async (text: string) => {
    if (!currentUser || !selectedUser || !text.trim()) return;
    const payload = {
      sender_id: currentUser.uuid,
      receiver_id: selectedUser.uuid,
      message: text,
    };
    const { data, error } = await supabase
      .from("messages")
      .insert([payload])
      .select("*")
      .single();

    if (!error) {
      const inserted: Message = data || {
        id: Math.random(),
        created_at: new Date().toISOString(),
        ...payload,
      } as unknown as Message;

      if (
        selectedUser &&
        ((inserted.sender_id === currentUser.uuid && inserted.receiver_id === selectedUser.uuid) ||
          (inserted.sender_id === selectedUser.uuid && inserted.receiver_id === currentUser.uuid))
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === (inserted as any).id)) return prev;
          return [...prev, inserted];
        });
      }

      setConversations((prev) => {
        const partnerUuid =
          inserted.sender_id === currentUser.uuid ? inserted.receiver_id : inserted.sender_id;
        const idx = prev.findIndex((c) => c.user.uuid === partnerUuid);
        const user =
          users.find((u) => u.uuid === partnerUuid) || {
            id: partnerUuid,
            name: `User ${partnerUuid}`,
            uuid: partnerUuid,
          };
        const newConv = { user, lastMessage: inserted } as Conversation;
        if (idx === -1) return [newConv, ...prev];
        const copy = [...prev];
        copy.splice(idx, 1);
        return [newConv, ...copy];
      });
    }
  };

  const startNewConversation = (userId: string): User | null => {
    const u = users.find((x) => x.id === userId || x.uuid === userId) || null;
    if (!u || !currentUser) return null;
    const existing = conversations.find((c) => c.user.uuid === u.uuid);
    if (existing) {
      setSelectedUser(existing.user);
      return existing.user;
    }
    setSelectedUser(u);
    setConversations((prev) => [{ user: u, lastMessage: null }, ...prev]);
    return u;
  };

  return {
    conversations,
    messages,
    users,
    selectedUser,
    currentUser,
    setSelectedUser,
    sendMessage,
    startNewConversation,
  };
}
