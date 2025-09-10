import { useState, useEffect } from "react";
import { supabase } from "../../../../supabaseClient";

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
};

export type Conversation = { user: User; lastMessage: Message | null };

export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser({
          id: data.user.id,
          name: data.user.email || "Me",
          uuid: data.user.id
        });
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, name, uuid");
      if (!error && data) {
        const usersWithStringIds = data.map(user => ({
          id: user.id.toString(),
          name: user.name,
          uuid: user.uuid
        }));
        setUsers(usersWithStringIds);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUser.uuid},receiver_id.eq.${currentUser.uuid}`)
        .order("created_at", { ascending: false });
      
      if (data && !error) {
        const conversationMap: Record<string, Conversation> = {};
        data.forEach((msg) => {
          const partnerId = msg.sender_id === currentUser.uuid ? msg.receiver_id : msg.sender_id;
          if (!conversationMap[partnerId]) {
            const partnerUser = users.find(u => u.uuid === partnerId) || { 
              id: partnerId, 
              name: `User ${partnerId}`,
              uuid: partnerId
            };
            conversationMap[partnerId] = { user: partnerUser, lastMessage: msg };
          }
        });
        
        const conversationArray = Object.values(conversationMap).sort((a, b) =>
          (b.lastMessage?.created_at.localeCompare(a.lastMessage?.created_at || "")) ?? 0
        );
        setConversations(conversationArray);
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
        .or(`and(sender_id.eq.${currentUser.uuid},receiver_id.eq.${selectedUser.uuid}),and(sender_id.eq.${selectedUser.uuid},receiver_id.eq.${currentUser.uuid})`)
        .order("created_at", { ascending: true });
      if (!error && data) setMessages(data);
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase.channel("public:messages");
    channel.on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `or(sender_id.eq.${currentUser.uuid},receiver_id.eq.${currentUser.uuid})`
    }, (payload) => {
      const newMsg = payload.new as Message;
      
      if (selectedUser && (
        (newMsg.sender_id === currentUser.uuid && newMsg.receiver_id === selectedUser.uuid) ||
        (newMsg.sender_id === selectedUser.uuid && newMsg.receiver_id === currentUser.uuid)
      )) {
        setMessages(msgs => [...msgs, newMsg]);
      }

      setConversations(convs => {
        const partnerId = newMsg.sender_id === currentUser.uuid ? newMsg.receiver_id : newMsg.sender_id;
        const idx = convs.findIndex(c => c.user.uuid === partnerId);
        const partnerUser = users.find(u => u.uuid === partnerId) || { 
          id: partnerId, 
          name: `User ${partnerId}`,
          uuid: partnerId
        };
        const updatedConv = { user: partnerUser, lastMessage: newMsg };
        
        if (idx === -1) return [updatedConv, ...convs];
        const newConvs = [...convs];
        newConvs.splice(idx, 1);
        return [updatedConv, ...newConvs];
      });
    }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser, selectedUser, users]);

  const sendMessage = async (text: string) => {
    if (!currentUser || !selectedUser || !text.trim()) return;
    
    console.log("Sending message:", {
      sender_id: currentUser.uuid,
      receiver_id: selectedUser.uuid,
      message: text
    });
    
    const { error } = await supabase.from("messages").insert([{
      sender_id: currentUser.uuid,
      receiver_id: selectedUser.uuid,
      message: text
    }]);

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    const optimistic: Message = {
      id: Date.now(),
      sender_id: currentUser.uuid,
      receiver_id: selectedUser.uuid,
      message: text,
      created_at: new Date().toISOString()
    };
    setMessages(msgs => [...msgs, optimistic]);
    setConversations(convs => {
      const idx = convs.findIndex(c => c.user.uuid === selectedUser.uuid);
      if (idx !== -1) convs.splice(idx, 1);
      return [{ user: selectedUser, lastMessage: optimistic }, ...convs];
    });
  };

  const startNewConversation = (userId: string) => {
    console.log("startNewConversation called with userId:", userId, typeof userId);
    
    const userToChat = users.find(u => u.id === userId);
    console.log("User to chat:", userToChat);
    
    if (!userToChat || !currentUser) {
      console.log("Missing userToChat or currentUser");
      return null;
    }

    const existingConv = conversations.find(c => c.user.uuid === userToChat.uuid);
    if (existingConv) {
      console.log("Existing conversation found, selecting user");
      setSelectedUser(existingConv.user);
      return existingConv.user;
    }

    console.log("Creating new conversation and selecting user");
    setSelectedUser(userToChat);
    setConversations(prev => [{ user: userToChat, lastMessage: null }, ...prev]);
    return userToChat;
  };

  return {
    conversations,
    messages,
    users,
    selectedUser,
    currentUser,
    setSelectedUser,
    sendMessage,
    startNewConversation
  };
}
