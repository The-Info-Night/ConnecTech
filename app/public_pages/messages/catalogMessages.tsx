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

export default function CatalogMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
      if (!error && data) {
        setUsers(data);
      }
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
            const user = users.find((u) => u.id === partnerId);
            if (user) {
              partnersMap[partnerId] = {
                user,
                lastMessage: msg,
              };
            }
          }
        });

        if (users.length === 0) {
          messagesData.forEach((msg: Message) => {
            const partnerId =
              msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
            if (!partnersMap[partnerId]) {
              partnersMap[partnerId] = {
                user: { id: partnerId, name: partnerId },
                lastMessage: msg,
              };
            }
          });
        }

        const convArr = Object.values(partnersMap).sort((a, b) =>
          (b.lastMessage?.created_at || "") > (a.lastMessage?.created_at || "")
            ? 1
            : -1
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
      if (!error && data) {
        setMessages(data);
      }
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUser) return;
    const { data, error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: newMessage,
      },
    ]);
    if (!error) {
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          content: newMessage,
          created_at: new Date().toISOString(),
        },
      ]);
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.user.id === selectedUser.id);
        const newConv: Conversation = {
          user: selectedUser,
          lastMessage: {
            id: Date.now(),
            sender_id: currentUser.id,
            receiver_id: selectedUser.id,
            content: newMessage,
            created_at: new Date().toISOString(),
          },
        };
        let updated = prev.filter((c) => c.user.id !== selectedUser.id);
        return [newConv, ...updated];
      });
    }
  };

  const getUserName = (user: User) => user.name || user.id;

  return (
    <div className="flex h-[80vh] border rounded-lg overflow-hidden bg-neutral-900">
      <nav className="w-64 min-w-[16rem] max-w-xs border-r bg-neutral-900 flex flex-col">
        <div className="p-4 border-b" style={{ backgroundColor: "#111111" }}>
          <h2 className="font-semibold text-lg">Conversations</h2>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <li className="p-4 text-neutral-300 text-sm">No conversations yet.</li>
          )}
          {conversations.map((conv) => (
            <li
              key={conv.user.id}
              className={`flex items-center gap-2 px-4 py-3 cursor-pointer border-b last:border-b-0
                ${
                  selectedUser?.id === conv.user.id
                    ? "bg-red-200 dark:bg-red-700"
                    : "hover:bg-red-200 dark:hover:bg-red-700"
                }`}
              onClick={() => setSelectedUser(conv.user)}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center font-bold uppercase">
                {getUserName(conv.user).slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{getUserName(conv.user)}</div>
                <div className="text-xs text-neutral-400 truncate">
                  {conv.lastMessage
                    ? conv.lastMessage.content
                    : "No messages yet"}
                </div>
              </div>
              {conv.lastMessage && (
                <div className="text-xs text-neutral-300 ml-2 whitespace-nowrap">
                  {new Date(conv.lastMessage.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                  {getUserName(selectedUser).slice(0, 2)}
                </div>
                <h3 className="font-semibold text-lg">
                  {getUserName(selectedUser)}
                </h3>
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
                    className={`flex ${
                      msg.sender_id === currentUser?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
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