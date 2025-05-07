import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Smile } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, recipient }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      text: message,
      senderId: 'currentUser',
      timestamp: 'Just now'
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div 
        ref={modalRef}
        style={{ 
          background: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          padding: '15px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={recipient.avatar} 
              alt={recipient.name} 
              style={{ 
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <h3 style={{ fontWeight: '600' }}>Chat with {recipient.name}</h3>
          </div>
          
          <button 
            onClick={onClose}
            style={{ 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={{ 
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {messages.length === 0 ? (
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: 'var(--text-light)'
            }}>
              <p>No messages yet</p>
              <p>Start the conversation with {recipient.name}</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.senderId === 'currentUser';
              
              return (
                <div 
                  key={msg.id}
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
                    {msg.text}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: 'var(--text-light)',
                    marginTop: '5px',
                    textAlign: isCurrentUser ? 'right' : 'left'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>
              );
            })
          )}
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
          
          <input 
            type="text"
            placeholder={`Message ${recipient.name}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
    </div>
  );
};

export default MessageModal;