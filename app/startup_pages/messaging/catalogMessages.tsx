"use client";
import React, { useState } from 'react';
import { useMessaging } from './components/useMessaging';
import ConversationList from './components/ConversationList';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

export default function CatalogMessages() {
  const {
    conversations,
    messages,
    users,
    selectedUser,
    currentUser,
    setSelectedUser,
    sendMessage,
    startNewConversation
  } = useMessaging();

  const [showNewConversationForm, setShowNewConversationForm] = useState(false);
  const [newConversationUserId, setNewConversationUserId] = useState('');

  const handleStartConversation = (userId: string) => {

    const selectedUserResult = startNewConversation(userId);

    if (selectedUserResult) {
      setShowNewConversationForm(false);
      setNewConversationUserId('');
      setSelectedUser(selectedUserResult);
    } else {
    }
  };

  const handleShowNewConversation = () => {
    setShowNewConversationForm(v => !v);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setShowNewConversationForm(false);
  };

  let eligibleUsers = users.filter(
    (user: any) => user.role === "founder" || user.role === "investor"
  );
  if (eligibleUsers.length === 0) {
    eligibleUsers = users;
  }


  return (
    <div className="flex flex-col md:flex-row h-[80vh] min-h-0 w-full border rounded-lg overflow-hidden shadow-lg">
      <ConversationList
        conversations={conversations}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        onShowNewConversation={handleShowNewConversation}
        users={eligibleUsers}
        currentUser={currentUser}
        onStartConversation={handleStartConversation}
        showNewConversationForm={showNewConversationForm}
        newConversationUserId={newConversationUserId}
        setNewConversationUserId={setNewConversationUserId}
      />

      <main className="flex-1 flex flex-col min-w-0 min-h-0" style={{ backgroundColor: "#fff" }}>
        <MessageList
          messages={messages}
          currentUser={currentUser}
          selectedUser={selectedUser}
          users={users}
        />
        <ChatInput
          onSendMessage={sendMessage}
          selectedUser={selectedUser}
        />
      </main>
    </div>
  );
}
