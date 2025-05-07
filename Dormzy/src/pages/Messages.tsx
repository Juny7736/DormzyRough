import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Smile, Image, X } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
  };
  messages: Message[];
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [
      {
        id: 'user2',
        name: 'John Smith',
        avatar: 'https://source.unsplash.com/random/100x100?portrait,2'
      }
    ],
    lastMessage: {
      text: 'Hello! I am interested!',
      timestamp: '1h ago',
      senderId: 'user2'
    },
    messages: [
      {
        id: 'msg1',
        senderId: 'user2',
        text: 'Hello! I am interested!',
        timestamp: '1h ago',
        read: true
      },
      {
        id: 'msg2',
        senderId: 'currentUser',
        text: 'Hello! Feel free to direct message me!',
        timestamp: '30min ago',
        read: true
      },
      {
        id: 'msg3',
        senderId: 'user2',
        text: 'Hello! Feel free to direct message me!',
        timestamp: '30min ago',
        read: true
      }
    ]
  },
  {
    id: 'conv2',
    participants: [
      {
        id: 'user3',
        name: 'Emma Wilson',
        avatar: 'https://source.unsplash.com/random/100x100?portrait,3'
      }
    ],
    lastMessage: {
      text: 'Is the apartment still available?',
      timestamp: '3h ago',
      senderId: 'user3'
    },
    messages: [
      {
        id: 'msg4',
        senderId: 'user3',
        text: 'Hi, I saw your listing for the apartment near campus.',
        timestamp: '3h ago',
        read: true
      },
      {
        id: 'msg5',
        senderId: 'user3',
        text: 'Is the apartment still available?',
        timestamp: '3h ago',
        read: true
      }
    ]
  },
  {
    id: 'conv3',
    participants: [
      {
        id: 'user4',
        name: 'Michael Chen',
        avatar: 'https://source.unsplash.com/random/100x100?portrait,4'
      }
    ],
    lastMessage: {
      text: 'Thanks for the information!',
      timestamp: '1d ago',
      senderId: 'currentUser'
    },
    messages: [
      {
        id: 'msg6',
        senderId: 'user4',
        text: 'Hello, do you know if utilities are included in the rent?',
        timestamp: '1d ago',
        read: true
      },
      {
        id: 'msg7',
        senderId: 'currentUser',
        text: 'Yes, water and internet are included, but electricity is separate.',
        timestamp: '1d ago',
        read: true
      },
      {
        id: 'msg8',
        senderId: 'user4',
        text: 'Got it, thanks!',
        timestamp: '1d ago',
        read: true
      },
      {
        id: 'msg9',
        senderId: 'currentUser',
        text: 'Thanks for the information!',
        timestamp: '1d ago',
        read: true
      }
    ]
  }
];

const Messages: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [filter, setFilter] = useState('all-time');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversationId, conversations, activeConversation]);
  
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: 'currentUser',
      text: newMessage,
      timestamp: 'Just now',
      read: false
    };
    
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMsg],
      lastMessage: {
        text: newMessage,
        timestamp: 'Just now',
        senderId: 'currentUser'
      }
    };
    
    setConversations(conversations.map(c => 
      c.id === activeConversation.id ? updatedConversation : c
    ));
    
    setActiveConversation(updatedConversation);
    setNewMessage('');
    
    setTimeout(scrollToBottom, 100);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };
  
  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    navigate(`/messages/${conversation.id}`);
  };
  
  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div style={{ 
          display: 'flex',
          height: 'calc(100vh - 120px)',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)'
        }}>
          {/* Conversations List */}
          <div style={{ 
            width: '300px',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '15px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Messages</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ 
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px'
                  }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="all-time">All time</option>
                  <option value="recent">Recent</option>
                </select>
              </div>
            </div>
            
            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              padding: '10px'
            }}>
              {conversations.map((conversation) => {
                const participant = conversation.participants[0];
                const isActive = activeConversation?.id === conversation.id;
                
                return (
                  <div 
                    key={conversation.id}
                    onClick={() => selectConversation(conversation)}
                    style={{ 
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '5px',
                      cursor: 'pointer',
                      background: isActive ? 'var(--secondary-color)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <img 
                      src={participant.avatar} 
                      alt={participant.name} 
                      style={{ 
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '5px'
                      }}>
                        <h3 style={{ fontWeight: '600' }}>{participant.name}</h3>
                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '14px',
                        color: 'var(--text-light)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px'
                      }}>
                        {conversation.lastMessage.senderId === 'currentUser' ? 'You: ' : ''}
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Conversation Detail */}
          {activeConversation ? (
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                padding: '15px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <button 
                  onClick={() => navigate('/messages')}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowLeft size={20} />
                </button>
                
                <img 
                  src={activeConversation.participants[0].avatar} 
                  alt={activeConversation.participants[0].name} 
                  style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                
                <div>
                  <h3 style={{ fontWeight: '600' }}>{activeConversation.participants[0].name}</h3>
                </div>
              </div>
              
              <div style={{ 
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {activeConversation.messages.map((message) => {
                  const isCurrentUser = message.senderId === 'currentUser';
                  
                  return (
                    <div 
                      key={message.id}
                      style={{ 
                        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                        maxWidth: '70%'
                      }}
                    >
                      <div style={{ 
                        background: isCurrentUser ? 'var(--primary-color)' : 'var(--secondary-color)',
                        color: isCurrentUser ? 'white' : 'var(--text-color)',
                        padding: '12px 15px',
                        borderRadius: '18px',
                        borderBottomLeftRadius: !isCurrentUser ? '5px' : '18px',
                        borderBottomRightRadius: isCurrentUser ? '5px' : '18px',
                      }}>
                        {message.text}
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: 'var(--text-light)',
                        marginTop: '5px',
                        textAlign: isCurrentUser ? 'right' : 'left'
                      }}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              
              <div style={{ 
                padding: '15px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-light)'
                }}>
                  <Smile size={20} />
                </button>
                
                <button style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-light)'
                }}>
                  <Image size={20} />
                </button>
                
                <input 
                  type="text"
                  placeholder="Reply to Jane Doe..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{ 
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '10px',
                    borderRadius: '20px',
                    background: 'var(--secondary-color)'
                  }}
                />
                
                <button 
                  onClick={handleSendMessage}
                  style={{ 
                    background: 'var(--primary-color)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              color: 'var(--text-light)'
            }}>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;