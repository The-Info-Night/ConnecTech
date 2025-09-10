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
    console.log("handleStartConversation called with:", userId);
    console.log("Selected user before:", selectedUser);
    
    const selectedUserResult = startNewConversation(userId);
    console.log("Selected user after startNewConversation:", selectedUserResult);
    
    if (selectedUserResult) {
      setShowNewConversationForm(false);
      setNewConversationUserId('');
      console.log("Manually setting selected user:", selectedUserResult);
      setSelectedUser(selectedUserResult);
    } else {
      console.log("No user returned from startNewConversation");
    }
  };

  const handleShowNewConversation = () => {
    setShowNewConversationForm(v => !v);
  };

  const handleSelectUser = (user: any) => {
    console.log("Selecting user:", user);
    setSelectedUser(user);
    setShowNewConversationForm(false);
  };

  console.log("Current states:", {
    selectedUser,
    conversations: conversations.length,
    users: users.length,
    currentUser
  });

  return (
    <div className="flex h-[80vh] w-full border rounded-lg overflow-hidden shadow-lg">
      <ConversationList
        conversations={conversations}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        onShowNewConversation={handleShowNewConversation}
        users={users}
        currentUser={currentUser}
        onStartConversation={handleStartConversation}
        showNewConversationForm={showNewConversationForm}
        newConversationUserId={newConversationUserId}
        setNewConversationUserId={setNewConversationUserId}
      />
      
      <main className="flex-1 flex flex-col" style={{ backgroundColor: "#fff" }}>
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
