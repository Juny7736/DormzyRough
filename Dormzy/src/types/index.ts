export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: {
    month: string;
    day: string;
    year: string;
  };
  status: string;
  school?: string;
  profilePicture?: string;
  joinedDate: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (userData: Partial<User>, password: string) => Promise<any>;
  logout: () => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>, currentPassword: string) => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
}

export interface Conversation {
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
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  read: boolean;
  timestamp: string;
}