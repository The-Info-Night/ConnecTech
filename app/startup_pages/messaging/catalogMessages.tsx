"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type User = {
  id: string;
  name: string;
};

type Conversation = {
  user: User;
  lastMessage: Message | null;
};

function useMobileBreakpoint(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
}

export default function CatalogMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isMobile = useMobileBreakpoint();
  const [showConversationPage, setShowConversationPage] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser({ id: data.user.id, name: data.user.email || "Me" });
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, name");
      if (!error && data) setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fetchConversations = async () => {
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (!error && messagesData) {
        const partnersMap: Record<string, Conversation> = {};
        messagesData.forEach((msg: Message) => {
          const partnerId =
            msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
          if (!partnersMap[partnerId]) {
            const user = users.find((u) => u.id === partnerId) ?? { id: partnerId, name: partnerId };
            partnersMap[partnerId] = { user, lastMessage: msg };
          }
        });
        const convArr = Object.values(partnersMap).sort((a, b) =>
          (b.lastMessage?.created_at || "") > (a.lastMessage?.created_at || "") ? 1 : -1
        );
        setConversations(convArr);
      }
    };
    fetchConversations();
  }, [currentUser, users]);

  useEffect(() => {
    if (!selectedUser || !currentUser) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });
      if (!error && data) setMessages(data);
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUser) return;
    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: newMessage,
      },
    ]);
    if (!error) {
      setNewMessage("");
      const newMsg: Message = {
        id: Date.now(),
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: newMessage,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.user.id === selectedUser.id);
        const newConv: Conversation = { user: selectedUser, lastMessage: newMsg };
        if (idx !== -1) prev.splice(idx, 1);
        return [newConv, ...prev];
      });
    }
  };

  const openConversation = (user: User) => {
    setSelectedUser(user);
    if (isMobile) setShowConversationPage(true);
  };
  const closeConversation = () => {
    setShowConversationPage(false);
    setSelectedUser(null);
  };

  if (isMobile) {
    if (!showConversationPage || !selectedUser) {
      return (
        <div className="flex flex-col h-[80vh] w-full bg-neutral-900 text-white">
          <div className="p-4 border-b border-neutral-700 bg-neutral-900 font-semibold text-lg">Conversations</div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.length === 0 && <li className="p-4 text-neutral-300 text-sm">No conversations yet.</li>}
            {conversations.map((conv) => (
              <li
                key={conv.user.id}
                className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer hover:bg-red-900"
                onClick={() => openConversation(conv.user)}
              >
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold uppercase">
                  {conv.user.name.slice(0,2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{conv.user.name}</div>
                  <div className="text-xs text-neutral-400 truncate">{conv.lastMessage?.content || "No messages yet"}</div>
                </div>
                {conv.lastMessage && (
                  <div className="text-xs text-neutral-300 ml-2">
                    {new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-[80vh] w-full bg-neutral-900 text-white">
        <div className="flex items-center p-3 border-b border-neutral-700 bg-neutral-900">
          <button className="mr-4 text-2xl font-bold" onClick={closeConversation} aria-label="Retour">{'←'}</button>
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold uppercase">
            {selectedUser.name.slice(0,2)}
          </div>
          <span className="ml-3 font-semibold">{selectedUser.name}</span>
        </div>
        <div className="flex-1 p-3 overflow-y-auto">
          {messages.length === 0 && <div className="text-neutral-400 text-sm">No messages yet. Say hello!</div>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUser?.id ? "justify-end" : "justify-start"} mb-1`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                  msg.sender_id === currentUser?.id ? "bg-red-500 text-white" : "bg-red-200 dark:bg-red-700"
                }`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className="text-xs text-neutral-400 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-3 border-t bg-neutral-700 flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 bg-neutral-800 rounded px-3 py-2 text-white"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold">
            Send
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] w-full border rounded-lg overflow-hidden bg-neutral-900 text-white">
      {/* Sidebar */}
      <nav className="w-64 min-w-[16rem] max-w-xs border-r border-neutral-700 bg-neutral-900 flex flex-col">
        <div className="p-4 border-b border-neutral-700 bg-neutral-900 font-semibold text-lg">Conversations</div>
        <ul className="flex-1 overflow-y-auto">
          {conversations.length === 0 && <li className="p-4 text-neutral-300 text-sm">No conversations yet.</li>}
          {conversations.map((conv) => (
            <li
              key={conv.user.id}
              className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer ${selectedUser?.id === conv.user.id ? "bg-red-900" : "hover:bg-red-700"}`}
              onClick={() => {
                setSelectedUser(conv.user);
                setShowConversationPage(true);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold uppercase">
                {conv.user.name.slice(0,2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{conv.user.name}</div>
                <div className="text-xs text-neutral-400 truncate">{conv.lastMessage?.content || "No messages yet"}</div>
              </div>
              {conv.lastMessage && (
                <div className="text-xs text-neutral-300 ml-2">
                  {new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <div className="w-10 h-10 rounded-full bg-red-400 text-white flex items-center justify-center font-bold uppercase">
                  {selectedUser.name.slice(0,2)}
                </div>
                <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
              </div>
              <div className="space-y-2">
                {messages.length === 0 && (
                  <div className="text-neutral-300 text-sm">
                    No messages yet. Say hello!
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                        msg.sender_id === currentUser?.id
                          ? "bg-red-500 text-white"
                          : "bg-red-200 dark:bg-red-700"
                      }`}
                    >
                      <div className="text-sm">{msg.content}</div>
                      <div className="text-xs text-neutral-400 mt-1 text-right">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-neutral-300 flex items-center h-full justify-center">
              Select a conversation from the left to start messaging.
            </div>
          )}
        </div>
        {selectedUser && (
          <form
            onSubmit={handleSend}
            className="p-4 border-t flex gap-2 bg-neutral-50 dark:bg-neutral-700"
          >
            <input
              type="text"
              className="flex-1 rounded border px-3 py-2"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
