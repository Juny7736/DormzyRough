import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    title: string;
    content: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  };
  onSubmit: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, post, onSubmit }) => {
  const [comment, setComment] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = () => {
    if (!comment.trim()) return;

    onSubmit(comment);
    setComment('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comment-modal-overlay">
      <div 
        ref={modalRef}
        className="comment-modal"
      >
        <div className="comment-modal-header">
          <h3 style={{ fontWeight: '600' }}>Reply to {post.user.name}</h3>

          <button 
            onClick={onClose}
            className="comment-modal-close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="comment-modal-post">
          <div className="comment-modal-user">
            <img 
              src={post.user.avatar} 
              alt={post.user.name} 
              className="comment-modal-avatar"
            />
            <div>
              <h4 style={{ fontWeight: '600' }}>{post.user.name}</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Original post</p>
            </div>
          </div>

          <h3 style={{ fontWeight: '600', marginBottom: '10px' }}>{post.title}</h3>
          <p>{post.content}</p>
        </div>

        <div className="comment-modal-form">
          <textarea
            placeholder="Write your reply..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            className="comment-textarea"
          ></textarea>

          <div className="comment-modal-actions">
            <button 
              onClick={onClose}
              className="comment-cancel-btn"
            >
              Cancel
            </button>

            <button 
              onClick={handleSubmit}
              className="comment-submit-btn"
            >
              <Send size={16} />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;