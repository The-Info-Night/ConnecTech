"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

type Message = { id: number; sender_id: string; receiver_id: string; content: string; created_at: string; };
type User = { id: string; name: string; };
type Conversation = { user: User; lastMessage: Message | null; };

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

const PASTEL = {
  violet: "#CB90F1",
  violetDark: "#7A3192",
  lavande: "#EED5FB",
  rose: "#F18585",
  saumon: "#F49C9C",
};

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
      if (data?.user) setCurrentUser({ id: data.user.id, name: data.user.email || "Me" });
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
          const partnerId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
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
      { sender_id: currentUser.id, receiver_id: selectedUser.id, content: newMessage },
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

  const sidebarBg = PASTEL.lavande;
  const sidebarText = PASTEL.violetDark;
  const selectedBg = `${PASTEL.violet}/20`;
  const hoverBg = `${PASTEL.lavande}/80`;
  const mainBg = "#fff";
  const mainText = PASTEL.violetDark;
  const accentText = PASTEL.violet;

  return (
    <div className="flex h-[80vh] w-full border rounded-lg overflow-hidden">
      <nav
        className="w-64 min-w-[16rem] max-w-xs border-r flex flex-col"
        style={{ background: sidebarBg, color: sidebarText, borderColor: PASTEL.violet }}
      >
        <div className="p-4 border-b font-extrabold text-lg bg-transparent"
          style={{ color: accentText, borderColor: PASTEL.violet }}>
          Conversations
        </div>
        <ul className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <li className="p-4 text-[#CB90F1] text-sm bg-white">No conversations yet.</li>
          )}
          {conversations.map((conv) => (
            <li
              key={conv.user.id}
              className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer rounded transition`}
              style={{
                borderColor: PASTEL.lavande,
                background: selectedUser?.id === conv.user.id ? selectedBg : mainBg,
                color: mainText,
              }}
              onMouseOver={e => { if (selectedUser?.id !== conv.user.id) e.currentTarget.style.background = hoverBg; }}
              onMouseOut={e => { e.currentTarget.style.background = selectedUser?.id === conv.user.id ? selectedBg : mainBg; }}
              onClick={() => { setSelectedUser(conv.user); setShowConversationPage(true); }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold uppercase shadow"
                style={{ background: PASTEL.violet }}
              >
                {conv.user.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold truncate" style={{ color: sidebarText }}>{conv.user.name}</div>
                <div className="text-xs" style={{ color: accentText }}>{conv.lastMessage?.content || "No messages yet"}</div>
              </div>
              {conv.lastMessage && (
                <div className="text-xs ml-2" style={{ color: accentText }}>
                  {new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 flex flex-col" style={{ background: mainBg, color: mainText }}>
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-2 mb-4 border-b pb-2 bg-white" style={{ borderColor: PASTEL.lavande }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold uppercase"
                  style={{ background: PASTEL.violet }}>
                  {selectedUser.name.slice(0, 2)}
                </div>
                <h3 className="font-bold text-lg" style={{ color: mainText }}>{selectedUser.name}</h3>
              </div>
              <div className="space-y-2">
                {messages.length === 0 && (
                  <div className="text-[#CB90F1] text-sm">
                    No messages yet. Say hello!
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="px-3 py-2 rounded-lg max-w-xs break-words shadow"
                      style={{
                        background: msg.sender_id === currentUser?.id ? PASTEL.violet : PASTEL.lavande,
                        color: msg.sender_id === currentUser?.id ? "#fff" : mainText
                      }}
                    >
                      <div className="text-sm">{msg.content}</div>
                      <div className="text-xs" style={{ color: accentText, textAlign: "right" }}>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center h-full justify-center text-[#CB90F1]">
              Select a conversation from the left to start messaging.
            </div>
          )}
        </div>
        {selectedUser && (
          <form
            onSubmit={handleSend}
            className="p-4 border-t flex gap-2 rounded-b-xl"
            style={{ borderColor: PASTEL.violet, background: mainBg }}
          >
            <input
              type="text"
              className="flex-1 rounded border px-3 py-2 font-medium"
              style={{
                borderColor: PASTEL.violet,
                background: PASTEL.lavande,
                color: mainText
              }}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded font-bold transition"
              style={{
                background: PASTEL.violet,
                color: "#fff"
              }}
            >
              Send
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
