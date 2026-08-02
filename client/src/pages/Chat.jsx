// src/pages/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatRooms, getChatMessages, sendMessage } from '../api/chat';
import { useSocket } from '../context/SocketContext';
import Button from '../components/Button';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();
  const { socket, isConnected, joinRoom, leaveRoom, on } = useSocket();

  // Get chat rooms
  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
  });

  // Get messages for selected room
  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ['chatMessages', selectedRoom],
    queryFn: () => getChatMessages(selectedRoom, { limit: 100 }),
    enabled: !!selectedRoom,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    },
  });

  // Update messages when data changes
  useEffect(() => {
    if (messagesData?.data) {
      setMessages(messagesData.data);
    }
  }, [messagesData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join room when selected
  useEffect(() => {
    if (selectedRoom && isConnected) {
      joinRoom(selectedRoom);
      refetchMessages();
    }

    return () => {
      if (selectedRoom) {
        leaveRoom(selectedRoom);
      }
    };
  }, [selectedRoom, isConnected]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.room === selectedRoom) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    on('chat:message', handleNewMessage);

    return () => {
      socket.off('chat:message', handleNewMessage);
    };
  }, [socket, selectedRoom, on]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedRoom) return;

    sendMessageMutation.mutate({
      room: selectedRoom,
      message: message.trim(),
    });
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room.id);
  };

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const rooms = roomsData?.rooms || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-600">Real-time communication with family members</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex">
        {/* Room List */}
        <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Chat Rooms</h3>
          <div className="space-y-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedRoom === room.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{room.name}</span>
                  {room.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedRoom ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderName === 'Guest' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.senderName === 'Guest'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-xs font-medium opacity-75 mb-1">
                        {msg.senderName}
                      </p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-4 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={!isConnected}
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || !isConnected}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </Button>
              </form>

              {!isConnected && (
                <div className="p-2 bg-yellow-50 border-t border-yellow-200 text-yellow-700 text-sm text-center">
                  ⚠️ Offline - Messages will be sent when reconnected
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChatBubbleLeftIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>Select a chat room to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;