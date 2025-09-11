import React, { useEffect, useRef } from 'react';
import { Message, User } from './useMessaging';

const PASTEL = {
  violet: "#CB90F1",
  violetDark: "#7A3192",
  lavande: "#EED5FB",
  rose: "#F18585",
  saumon: "#F49C9C",
};

type Props = {
  messages: Message[];
  currentUser: User | null;
  selectedUser: User | null;
  users: User[];
};

export default function MessageList({ messages, currentUser, selectedUser, users }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, selectedUser?.uuid]);
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: PASTEL.violet }}>
        Select a conversation to start messaging
      </div>
    );
  }

  const nameByUuid: Record<string,string> = {};
  users.forEach(u => {
    nameByUuid[u.uuid] = u.name;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <header className="p-3 sm:p-4 border-b flex items-center gap-2 sm:gap-3" style={{ borderColor: PASTEL.lavande, backgroundColor: "#fff" }}>
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold uppercase text-sm"
          style={{ backgroundColor: PASTEL.violet }}
        >
          {selectedUser.name.slice(0, 2)}
        </div>
        <h2 className="font-bold text-base sm:text-lg" style={{ color: PASTEL.violetDark }}>
          {selectedUser.name}
        </h2>
      </header>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-2 sm:space-y-3 bg-white min-h-0">
        {messages.length === 0 ? (
          <div className="text-center" style={{ color: PASTEL.violet }}>
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map(msg => {
            const isOwn = msg.sender_id === currentUser?.uuid;
            const senderName = isOwn ? "You" : (nameByUuid[msg.sender_id] || "Unknown user");

            return (
              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className="px-3 sm:px-4 py-2 rounded-lg max-w-[75%] sm:max-w-xs break-words shadow-sm"
                  style={{
                    backgroundColor: isOwn ? PASTEL.violet : PASTEL.lavande,
                    color: isOwn ? "#fff" : PASTEL.violetDark
                  }}
                >
                  {!isOwn && (
                    <div className="text-[10px] sm:text-xs font-semibold mb-1">{senderName}</div>
                  )}
                  <div className="text-xs sm:text-sm leading-relaxed">{msg.message}</div>
                  <div
                    className="text-[10px] sm:text-xs mt-1"
                    style={{
                      color: isOwn ? "#fff" : PASTEL.violet,
                      textAlign: "right"
                    }}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
