import React, { useState } from 'react';
import { User } from './useMessaging';

const PASTEL = {
  violet: "#CB90F1",
  violetDark: "#7A3192",
  lavande: "#EED5FB",
  rose: "#F18585",
  saumon: "#F49C9C",
};

type Props = {
  onSendMessage: (text: string) => void;
  selectedUser: User | null;
};

export default function ChatInput({ onSendMessage, selectedUser }: Props) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    onSendMessage(message);
    setMessage("");
  };

  if (!selectedUser) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-4 border-t flex gap-2 sm:gap-3"
      style={{ borderColor: PASTEL.lavande, backgroundColor: "#fff" }}
    >
      <input
        type="text"
        className="flex-1 rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 transition"
        style={{
          borderColor: PASTEL.violet,
          backgroundColor: PASTEL.lavande,
          color: PASTEL.violetDark
        }}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={(e) => {
          e.target.classList.add("focus-ring-violet");
        }}
        onBlur={(e) => {
          e.target.classList.remove("focus-ring-violet");
        }}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition disabled:opacity-50 hover:opacity-90"
        style={{ backgroundColor: PASTEL.violet, color: "#fff" }}
      >
        Send
      </button>
    </form>
  );
}
