# Dormzy - Student Housing Platform

Dormzy is a comprehensive platform designed to help students find housing near their campus. The application provides a user-friendly interface for browsing listings, connecting with potential roommates, and managing housing preferences.

## Features

- User authentication with email verification
- Property listings with detailed information
- Interactive map view for location-based search
- Messaging system for communication between users
- Community forum for housing discussions
- User profiles with customization options
- Saved listings and preferences

## Tech Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: 
- **Storage**: 
- **Maps**: Google Maps API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ``` ```bash
git clone https://github.com/yourusername/dormzy.git
cd dormzy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the `.env.example` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MySQL credentials and other configuration options.

5. Start the development server:
```bash
npm run dev
```

6. In a separate terminal, start the backend server:
```bash
npm run server
```

## Database Setup

The application uses MySQL for data storage. The database schema is automatically created when you start the server for the first time. The following tables are created:

- `users`: Stores user information
- `properties`: Stores property listings
- `property_images`: Stores images for properties
- `property_amenities`: Stores amenities for properties
- `posts`: Stores community forum posts
- `comments`: Stores comments on posts
- `conversations`: Stores messaging conversations
- `conversation_participants`: Stores participants in conversations
- `messages`: Stores individual messages
- `saved_properties`: Stores saved/favorited properties

## API Endpoints

### Users
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create a new user
- `PUT /api/users/:id`: Update a user
- `GET /api/users/check-email/:email`: Check if email exists

### Properties
- `GET /api/properties`: Get all properties (with filtering)
- `GET /api/properties/:id`: Get property by ID
- `POST /api/properties`: Create a new property
- `PUT /api/properties/:id`: Update a property
- `GET /api/properties/host/:hostId`: Get properties by host ID

### Messages
- `GET /api/messages/conversations/:userId`: Get all conversations for a user
- `GET /api/messages/conversations/:conversationId/messages`: Get messages for a conversation
- `POST /api/messages/conversations/:conversationId/messages`: Send a message
- `POST /api/messages/conversations`: Create a new conversation
- `PUT /api/messages/conversations/:conversationId/read`: Mark messages as read

### Posts
- `GET /api/posts`: Get all posts
- `GET /api/posts/:id`: Get post by ID with comments
- `POST /api/posts`: Create a new post
- `POST /api/posts/:id/comments`: Add a comment to a post
- `GET /api/posts/user/:userId`: Get posts by user ID


