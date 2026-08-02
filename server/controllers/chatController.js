import Chat from '../models/Chat.js';
import { io } from '../server.js';

// Predefined chat rooms
const CHAT_ROOMS = [
  'general',
  'announcements',
  'family_discussion',
  'events',
  'genealogy_help',
];

export const getChatRooms = async (req, res) => {
  try {
    res.json({
      rooms: CHAT_ROOMS.map(room => ({
        id: room,
        name: room.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { room } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!CHAT_ROOMS.includes(room)) {
      return res.status(400).json({ message: 'Invalid chat room' });
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Chat.find({ room })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Chat.countDocuments({ room }),
    ]);

    res.json({
      data: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { room, message } = req.body;

    if (!CHAT_ROOMS.includes(room)) {
      return res.status(400).json({ message: 'Invalid chat room' });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const chatMessage = new Chat({
      room,
      sender: req.user?._id || null,
      senderName: req.user?.name || 'Guest',
      message: message.trim(),
    });

    await chatMessage.save();

    // Emit to all clients in the room
    io.to(room).emit('chat:message', chatMessage);

    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { room } = req.params;

    if (!CHAT_ROOMS.includes(room)) {
      return res.status(400).json({ message: 'Invalid chat room' });
    }

    await Chat.updateMany(
      { room, isRead: false },
      { 
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const counts = await Promise.all(
      CHAT_ROOMS.map(async (room) => {
        const count = await Chat.countDocuments({ room, isRead: false });
        return { room, unread: count };
      })
    );

    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};