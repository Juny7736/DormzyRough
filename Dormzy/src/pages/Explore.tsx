import React, { useState } from 'react';
import { MessageCircle, Heart, Share2, User, X } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import CommentModal from '../components/CommentModal';

interface PostData {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    content: string;
    date: string;
  }[];
}

// Mock data for initial development
const mockPosts: PostData[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar: 'https://source.unsplash.com/random/100x100?portrait,1'
    },
    title: 'Looking for a roommate near UW Seattle',
    content: 'Hey everyone! I\'m a junior at UW looking for a roommate to share a 2-bedroom apartment in the University District. Budget is around $800-900 per person. I\'m clean, quiet, and respectful. Message me if you\'re interested!',
    date: '2 hours ago',
    likes: 5,
    comments: [
      {
        id: 'comment1',
        user: {
          id: 'user2',
          name: 'Michael Chen',
          avatar: 'https://source.unsplash.com/random/100x100?portrait,2'
        },
        content: 'I might be interested! When are you looking to move in?',
        date: '1 hour ago'
      }
    ]
  },
  {
    id: '2',
    user: {
      id: 'user3',
      name: 'Emma Wilson',
      avatar: 'https://source.unsplash.com/random/100x100?portrait,3'
    },
    title: 'Subletting my studio for summer quarter',
    content: 'I\'m subletting my studio apartment from June to September while I\'m away for an internship. It\'s fully furnished, has a great view, and is only a 10-minute walk to campus. Rent is $1,100/month, utilities included. Let me know if you\'re interested!',
    date: '5 hours ago',
    likes: 12,
    comments: []
  }
];

const Explore: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<PostData[]>(mockPosts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleAddPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: PostData = {
      id: `post${Date.now()}`,
      user: {
        id: currentUser?.id || 'guest',
        name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User',
        avatar: currentUser?.profilePicture || 'https://source.unsplash.com/random/100x100?portrait,10'
      },
      title: newPostTitle,
      content: newPostContent,
      date: 'Just now',
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleAddComment = (postId: string, commentContent?: string) => {
    const content = commentContent || commentInputs[postId];
    if (!content?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `comment${Date.now()}`,
          user: {
            id: currentUser?.id || 'guest',
            name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User',
            avatar: currentUser?.profilePicture || 'https://source.unsplash.com/random/100x100?portrait,10'
          },
          content: content,
          date: 'Just now'
        };

        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs({
      ...commentInputs,
      [postId]: ''
    });
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  const openCommentModal = (post: PostData) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
  };

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
        <div style={{ 
          display: 'flex',
          gap: '30px'
        }}>
          <div style={{ flex: '1 1 70%' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              Explore Student Housing Community
            </h2>

            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>Create a Post</h3>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Post title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <textarea
                  placeholder="What's on your mind? Ask about housing, find roommates, or share tips..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  style={{ 
                    width: '100%',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleAddPost}
                  className="btn btn-primary"
                >
                  Post
                </button>
              </div>
            </div>

            {filteredPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img 
                    src={post.user.avatar} 
                    alt={post.user.name} 
                    className="post-avatar"
                  />
                  <div>
                    <div className="post-user">{post.user.name}</div>
                    <div className="post-date">{post.date}</div>
                  </div>
                </div>

                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>

                <div className="post-actions">
                  <button 
                    className="post-action-btn"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button 
                    className="post-action-btn"
                    onClick={() => openCommentModal(post)}
                  >
                    <MessageCircle size={18} />
                    <span>{post.comments.length} Comments</span>
                  </button>

                  <button className="post-action-btn">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>

                <div className="comments-section">
                  {post.comments.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
                        Comments ({post.comments.length})
                      </h4>
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <img 
                            src={comment.user.avatar} 
                            alt={comment.user.name} 
                            className="comment-avatar"
                          />
                          <div className="comment-content">
                            <div className="comment-user">{comment.user.name}</div>
                            <p className="comment-text">{comment.content}</p>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '5px' }}>
                              {comment.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="comment-form">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="comment-input"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({
                        ...commentInputs,
                        [post.id]: e.target.value
                      })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddComment(post.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: '1 1 30%' }}>
            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>Community Guidelines</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li style={{ marginBottom: '10px' }}>Be respectful and kind to other members</li>
                <li style={{ marginBottom: '10px' }}>No spam or promotional content</li>
                <li style={{ marginBottom: '10px' }}>Verify information before sharing</li>
                <li style={{ marginBottom: '10px' }}>Report suspicious listings or scams</li>
                <li>Protect your personal information</li>
              </ul>
            </div>

            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>Popular Topics</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <a href="#" className="btn btn-secondary" style={{ fontSize: '14px', padding: '5px 10px' }}>
                  Roommate Search
                </a>
                <a href="#" className="btn btn-secondary" style={{ fontSize: '14px', padding: '5px 10px' }}>
                  Subletting
                </a>
                <a href="#" className="btn btn-secondary" style={{ fontSize: '14px', padding: '5px 10px' }}>
                  Housing Tips
                </a>
                <a href="#" className="btn btn-secondary" style={{ fontSize: '14px', padding: '5px 10px' }}>
                  Affordable Options
                </a>
                <a href="#" className="btn btn-secondary" style={{ fontSize: '14px', padding: '5px 10px' }}>
                  International Students
                </a>
                <a href="#" className="btn btn-secondary" style={{ fontSize: '14px', padding: '5px 10px' }}>
                  Graduate Housing
                </a>
              </div>
            </div>

            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--shadow)'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px' }}>Active Members</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={`https://source.unsplash.com/random/100x100?portrait,${num + 10}`} 
                      alt={`User ${num}`} 
                      style={{ 
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {['Alex Smith', 'Jamie Wong', 'Taylor Reed', 'Jordan Lee', 'Casey Miller'][num - 1]}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                        {['5 posts', '3 posts', '7 posts', '2 posts', '4 posts'][num - 1]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          post={{
            id: selectedPost.id,
            title: selectedPost.title,
            content: selectedPost.content,
            user: selectedPost.user
          }}
          onSubmit={(comment) => handleAddComment(selectedPost.id, comment)}
        />
      )}
    </>
  );
};

export default Explore;