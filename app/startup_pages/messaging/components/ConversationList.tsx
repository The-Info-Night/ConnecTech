import React from 'react';
import { Conversation, User } from './useMessaging';

const PASTEL = {
  violet: "#CB90F1",
  violetDark: "#7A3192",
  lavande: "#EED5FB",
  rose: "#F18585",
  saumon: "#F49C9C",
};

type Props = {
  conversations: Conversation[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onShowNewConversation: () => void;
  users: User[];
  currentUser: User | null;
  onStartConversation: (userId: string) => void;
  showNewConversationForm: boolean;
  newConversationUserId: string;
  setNewConversationUserId: (id: string) => void;
};

export default function ConversationList({
  conversations,
  selectedUser,
  onSelectUser,
  onShowNewConversation,
  users,
  currentUser,
  onStartConversation,
  showNewConversationForm,
  newConversationUserId,
  setNewConversationUserId,
}: Props) {
  return (
    <nav
      className="w-full md:w-64 md:min-w-[16rem] md:max-w-xs border-r flex flex-col"
      style={{ background: PASTEL.lavande, color: PASTEL.violetDark, borderColor: PASTEL.violet }}
    >
      <div
        className="p-4 border-b flex justify-between items-center"
        style={{ color: PASTEL.violet, borderColor: PASTEL.violet }}
      >
        <span className="font-extrabold text-lg">Conversations</span>
        <button
          className="text-xl font-extrabold hover:opacity-80 transition"
          onClick={onShowNewConversation}
          title="New Conversation"
          style={{ color: PASTEL.violet }}
        >
          +
        </button>
      </div>

      {showNewConversationForm && (
        <div
          className="p-4 border-b"
          style={{ backgroundColor: PASTEL.lavande, borderColor: PASTEL.lavande }}
        >
          <select
            className="w-full mb-2 p-2 rounded border"
            style={{ borderColor: PASTEL.violet }}
            value={newConversationUserId}
            onChange={(e) => setNewConversationUserId(e.target.value)}
          >
            <option value="">Select a user</option>
            {users
              .filter(u => u.uuid !== currentUser?.uuid)
              .map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
          <button
  className="w-full py-2 rounded font-medium disabled:opacity-50 transition"
  style={{ backgroundColor: PASTEL.violet, color: "#fff" }}
  disabled={!newConversationUserId}
  onClick={() => {
    onStartConversation(newConversationUserId);
  }}
>
  Start Conversation
</button>
        </div>
      )}

      <ul className="flex-1 overflow-auto">
        {conversations.length === 0 ? (
          <li className="p-4 text-center" style={{ color: PASTEL.violet }}>
            No conversations yet.
          </li>
        ) : (
          conversations.map(conv => (
            <li
              key={conv.user.id}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition border-b"
              style={{
                background: conv.user.id === selectedUser?.id ? `${PASTEL.violet}33` : "#fff",
                color: PASTEL.violetDark,
                borderColor: PASTEL.lavande
              }}
              onClick={() => onSelectUser(conv.user)}
              onMouseEnter={(e) => {
                if (conv.user.id !== selectedUser?.id) {
                  e.currentTarget.style.backgroundColor = `${PASTEL.lavande}80`;
                }
              }}
              onMouseLeave={(e) => {
                if (conv.user.id !== selectedUser?.id) {
                  e.currentTarget.style.backgroundColor = "#fff";
                }
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold uppercase text-sm"
                style={{ backgroundColor: PASTEL.violet }}
              >
                {conv.user.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold truncate">{conv.user.name}</div>
                <div className="text-xs truncate" style={{ color: PASTEL.violet }}>
                  {conv.lastMessage?.message || "No messages yet"}
                </div>
              </div>
              {conv.lastMessage && (
                <div className="text-xs" style={{ color: PASTEL.violet }}>
                  {new Date(conv.lastMessage.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}
