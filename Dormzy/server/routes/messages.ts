import express from 'express';
import pool from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id as conversation_id,
        c.created_at,
        c.updated_at,
        (
          SELECT m.text
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) as last_message,
        (
          SELECT m.sender_id
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) as last_message_sender_id,
        (
          SELECT m.created_at
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) as last_message_timestamp,
        (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.id
          AND m.read = 0
          AND m.sender_id != ?
        ) as unread_count
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE cp.user_id = ?
      ORDER BY c.updated_at DESC
    `;
    
    const [conversations] = await pool.query(query, [req.params.userId, req.params.userId]);
    
    // For each conversation, get the other participants
    const conversationsWithParticipants = await Promise.all(
      Array.isArray(conversations) ? conversations.map(async (conversation) => {
        const participantsQuery = `
          SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.profile_picture as avatar
          FROM conversation_participants cp
          JOIN users u ON cp.user_id = u.id
          WHERE cp.conversation_id = ?
          AND cp.user_id != ?
        `;
        
        const [participants] = await pool.query(participantsQuery, [
          conversation.conversation_id,
          req.params.userId
        ]);
        
        return {
          id: conversation.conversation_id,
          participants: Array.isArray(participants) ? participants.map(p => ({
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
            avatar: p.avatar || 'https://source.unsplash.com/random/100x100?portrait'
          })) : [],
          lastMessage: {
            text: conversation.last_message || '',
            timestamp: conversation.last_message_timestamp || conversation.created_at,
            senderId: conversation.last_message_sender_id || ''
          },
          unreadCount: conversation.unread_count || 0,
          createdAt: conversation.created_at,
          updatedAt: conversation.updated_at
        };
      }) : []
    );
    
    res.json(conversationsWithParticipants);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id,
        m.sender_id,
        m.text,
        m.read,
        m.created_at
      FROM messages m
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `;
    
    const [messages] = await pool.query(query, [req.params.conversationId]);
    
    res.json(Array.isArray(messages) ? messages.map(message => ({
      id: message.id,
      senderId: message.sender_id,
      text: message.text,
      read: !!message.read,
      timestamp: message.created_at
    })) : []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { senderId, text } = req.body;
    
    // Insert the message
    const messageId = uuidv4();
    await pool.query(
      'INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (?, ?, ?, ?)',
      [messageId, req.params.conversationId, senderId, text]
    );
    
    // Update the conversation's updated_at timestamp
    await pool.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.params.conversationId]
    );
    
    res.status(201).json({ 
      id: messageId,
      senderId,
      text,
      read: false,
      timestamp: new Date().toISOString(),
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create a new conversation
router.post('/conversations', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { participants, initialMessage } = req.body;
    
    if (!Array.isArray(participants) || participants.length < 2) {
      await connection.rollback();
      return res.status(400).json({ error: 'At least two participants are required' });
    }
    
    // Check if a conversation already exists between these participants
    if (participants.length === 2) {
      const existingConversationQuery = `
        SELECT c.id
        FROM conversations c
        JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = ?
        JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = ?
        GROUP BY c.id
        HAVING COUNT(DISTINCT cp1.user_id, cp2.user_id) = 2
      `;
      
      const [existingConversations] = await connection.query(
        existingConversationQuery,
        [participants[0], participants[1]]
      );
      
      if (Array.isArray(existingConversations) && existingConversations.length > 0) {
        const conversationId = existingConversations[0].id;
        
        // If there's an initial message, add it
        if (initialMessage) {
          const messageId = uuidv4();
          await connection.query(
            'INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (?, ?, ?, ?)',
            [messageId, conversationId, initialMessage.senderId, initialMessage.text]
          );
          
          // Update the conversation's updated_at timestamp
          await connection.query(
            'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [conversationId]
          );
        }
        
        await connection.commit();
        return res.status(200).json({ 
          id: conversationId, 
          message: 'Conversation already exists',
          isNew: false
        });
      }
    }
    
    // Create a new conversation
    const conversationId = uuidv4();
    await connection.query(
      'INSERT INTO conversations (id) VALUES (?)',
      [conversationId]
    );
    
    // Add participants
    const participantValues = participants.map(userId => [uuidv4(), conversationId, userId]);
    await connection.query(
      'INSERT INTO conversation_participants (id, conversation_id, user_id) VALUES ?',
      [participantValues]
    );
    
    // If there's an initial message, add it
    if (initialMessage) {
      const messageId = uuidv4();
      await connection.query(
        'INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (?, ?, ?, ?)',
        [messageId, conversationId, initialMessage.senderId, initialMessage.text]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({ 
      id: conversationId, 
      message: 'Conversation created successfully',
      isNew: true
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  } finally {
    connection.release();
  }
});

// Mark messages as read
router.put('/conversations/:conversationId/read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    await pool.query(
      'UPDATE messages SET read = TRUE WHERE conversation_id = ? AND sender_id != ?',
      [req.params.conversationId, userId]
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;