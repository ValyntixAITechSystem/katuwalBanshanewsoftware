import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Users } from 'lucide-react';
import { chatService } from '../api/chatService';
import { socketService } from '../api/socketService';
import { useChatRoom } from '../hooks/useSocket';
import { CHAT_ROOMS } from '../utils/constants';
import { timeAgo } from '../utils/formatters';
import toast from 'react-hot-toast';

export const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(CHAT_ROOMS[0].id);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useChatRoom(currentRoom);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      fetchUnreadCounts();
    }
  }, [currentRoom, isOpen]);

  useEffect(() => {
    const socket = socketService.connect();
    socket.on('chat:message', handleNewMessage);

    return () => {
      socket.off('chat:message');
    };
  }, [currentRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(currentRoom, { limit: 50 });
      setMessages(response.data.data);
      await chatService.markAsRead(currentRoom);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const response = await chatService.getUnreadCount();
      const counts = {};
      response.data.forEach(item => {
        counts[item.room] = item.unread;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Failed to fetch unread counts:', error);
    }
  };

  const handleNewMessage = (message) => {
    if (message.room === currentRoom) {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatService.sendMessage({
        room: currentRoom,
        message: newMessage.trim(),
      });
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        <div className="relative">
          <MessageSquare size={24} />
          {totalUnread > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </div>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-green-600 text-white">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <span className="font-semibold">Chat</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-green-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Room Selector */}
            <div className="flex gap-1 p-2 border-b border-gray-200 overflow-x-auto">
              {CHAT_ROOMS.map(room => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`px-3 py-1 text-sm rounded-lg transition whitespace-nowrap ${
                    currentRoom === room.id
                      ? 'bg-green-100 text-green-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {room.label}
                    {unreadCounts[room.id] > 0 && currentRoom !== room.id && (
                      <span className="w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCounts[room.id]}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderName === 'Guest' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.senderName === 'Guest'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.senderName}
                        </span>
                        <span className="text-xs opacity-70">
                          {timeAgo(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm break-words">{message.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};