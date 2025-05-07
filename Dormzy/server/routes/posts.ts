import express from 'express';
import pool from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const query = `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.profile_picture,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.query(query, [Number(limit), Number(offset)]);
    
    // Format the results
    const posts = Array.isArray(rows) ? rows.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      user: {
        id: post.user_id,
        name: `${post.first_name} ${post.last_name}`,
        avatar: post.profile_picture || 'https://source.unsplash.com/random/100x100?portrait'
      },
      commentCount: post.comment_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })) : [];
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get post by ID with comments
router.get('/:id', async (req, res) => {
  try {
    // Get the post
    const postQuery = `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.profile_picture
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;
    
    const [postRows] = await pool.query(postQuery, [req.params.id]);
    
    if (Array.isArray(postRows) && postRows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const post = postRows[0];
    
    // Get the comments
    const commentsQuery = `
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.profile_picture
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    
    const [commentRows] = await pool.query(commentsQuery, [req.params.id]);
    
    // Format the response
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      user: {
        id: post.user_id,
        name: `${post.first_name} ${post.last_name}`,
        avatar: post.profile_picture || 'https://source.unsplash.com/random/100x100?portrait'
      },
      comments: Array.isArray(commentRows) ? commentRows.map(comment => ({
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.user_id,
          name: `${comment.first_name} ${comment.last_name}`,
          avatar: comment.profile_picture || 'https://source.unsplash.com/random/100x100?portrait'
        },
        createdAt: comment.created_at
      })) : [],
      createdAt: post.created_at,
      updatedAt: post.updated_at
    };
    
    res.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO posts (id, user_id, title, content) VALUES (?, ?, ?, ?)',
      [id, userId, title, content]
    );
    
    res.status(201).json({ id, message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Add a comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    const id = uuidv4();
    
    await pool.query(
      'INSERT INTO comments (id, post_id, user_id, content) VALUES (?, ?, ?, ?)',
      [id, req.params.id, userId, content]
    );
    
    // Get the user info for the response
    const [userRows] = await pool.query(
      'SELECT first_name, last_name, profile_picture FROM users WHERE id = ?',
      [userId]
    );
    
    if (Array.isArray(userRows) && userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userRows[0];
    
    res.status(201).json({
      id,
      content,
      user: {
        id: userId,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.profile_picture || 'https://source.unsplash.com/random/100x100?portrait'
      },
      createdAt: new Date().toISOString(),
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get posts by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.profile_picture,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `;
    
    const [rows] = await pool.query(query, [req.params.userId]);
    
    // Format the results
    const posts = Array.isArray(rows) ? rows.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      user: {
        id: post.user_id,
        name: `${post.first_name} ${post.last_name}`,
        avatar: post.profile_picture || 'https://source.unsplash.com/random/100x100?portrait'
      },
      commentCount: post.comment_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })) : [];
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

export default router;