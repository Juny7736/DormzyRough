import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, AuthContextType } from '../types';
import { auth } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile as updateFirebaseProfile,
  fetchSignInMethodsForEmail,
  AuthErrorCodes
} from 'firebase/auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  verifyCode: async () => false,
  updateProfile: async () => {},
  checkEmailExists: async () => false,
});

export const useAuth = () => useContext(AuthContext);

// Store user data in localStorage for persistence
const LOCAL_STORAGE_KEY = 'dormzy_user_data';
// Store registered emails in localStorage for development mode
const REGISTERED_EMAILS_KEY = 'dormzy_registered_emails';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);

  // Load registered emails from localStorage for development mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      const savedEmails = localStorage.getItem(REGISTERED_EMAILS_KEY);
      if (savedEmails) {
        try {
          setRegisteredEmails(JSON.parse(savedEmails));
        } catch (e) {
          console.error('Error parsing saved emails:', e);
        }
      }
    }
  }, []);

  // Load user from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user data:', e);
      }
    }
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // In development, we might not have a real database connection
          // So we'll create a mock user if the API call fails
          let userData: User | null = null;
          
          try {
            // Try to get user data from the API
            const response = await axios.get(`${API_URL}/users/${user.uid}`);
            if (response.data) {
              userData = {
                id: user.uid,
                firstName: response.data.first_name,
                lastName: response.data.last_name,
                email: response.data.email,
                phoneNumber: response.data.phone_number || '',
                dateOfBirth: { 
                  month: response.data.date_of_birth_month || '', 
                  day: response.data.date_of_birth_day || '', 
                  year: response.data.date_of_birth_year || '' 
                },
                status: response.data.status || 'Student',
                school: response.data.school || '',
                profilePicture: response.data.profile_picture || '',
                joinedDate: response.data.joined_date
              };
            }
          } catch (error) {
            console.warn('API error (using mock data):', error);
            // Create mock user data for development
            userData = {
              id: user.uid,
              firstName: user.displayName?.split(' ')[0] || 'Test',
              lastName: user.displayName?.split(' ')[1] || 'User',
              email: user.email || 'test@example.com',
              phoneNumber: '',
              dateOfBirth: { month: 'January', day: '1', year: '2000' },
              status: 'Student',
              school: 'Test University',
              profilePicture: user.photoURL || '',
              joinedDate: new Date().toISOString()
            };
          }
          
          if (userData) {
            setCurrentUser(userData);
            // Save to localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setCurrentUser(null);
        // Clear localStorage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const generateVerificationCode = (): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    return code;
  };

  const sendVerificationEmail = async (email: string, code: string) => {
    // In a real app, you would use a service like SendGrid or AWS SES
    // For this demo, we'll just log the code
    console.log(`Verification code sent to ${email}: ${code}`);
    
    // Simulate email sending
    return Promise.resolve();
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // For development mode, check against our local storage
      if (import.meta.env.DEV) {
        return registeredEmails.includes(email);
      }
      
      // In production, check with the API
      const response = await axios.get(`${API_URL}/users/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For development, we'll create a mock successful login
      // This prevents Firebase API errors in development
      if (import.meta.env.DEV) {
        // Check if email is registered
        if (!registeredEmails.includes(email)) {
          throw new Error('Email not found. Please sign up first.');
        }
        
        // Try to get saved user data from localStorage
        const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        let mockUser: User;
        
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            // Check if this is the same email
            if (parsedUser.email === email) {
              mockUser = parsedUser;
            } else {
              // Different email, create new mock user
              mockUser = {
                id: 'dev-user-id',
                firstName: 'Dev',
                lastName: 'User',
                email: email,
                phoneNumber: '555-123-4567',
                dateOfBirth: { month: 'January', day: '1', year: '2000' },
                status: 'Student',
                school: 'Dev University',
                profilePicture: '',
                joinedDate: new Date().toISOString()
              };
            }
          } catch (e) {
            // Fallback to default mock user
            mockUser = {
              id: 'dev-user-id',
              firstName: 'Dev',
              lastName: 'User',
              email: email,
              phoneNumber: '555-123-4567',
              dateOfBirth: { month: 'January', day: '1', year: '2000' },
              status: 'Student',
              school: 'Dev University',
              profilePicture: '',
              joinedDate: new Date().toISOString()
            };
          }
        } else {
          // No saved user, create default mock user
          mockUser = {
            id: 'dev-user-id',
            firstName: 'Dev',
            lastName: 'User',
            email: email,
            phoneNumber: '555-123-4567',
            dateOfBirth: { month: 'January', day: '1', year: '2000' },
            status: 'Student',
            school: 'Dev University',
            profilePicture: '',
            joinedDate: new Date().toISOString()
          };
        }
        
        setCurrentUser(mockUser);
        // Save to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
        
        const code = generateVerificationCode();
        await sendVerificationEmail(email, code);
        
        return { uid: 'dev-user-id' };
      }
      
      // In production, this would use the real Firebase auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const code = generateVerificationCode();
      await sendVerificationEmail(email, code);
      
      return userCredential.user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.code === AuthErrorCodes.USER_DELETED) {
        throw new Error('Email not found. Please sign up first.');
      } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to log in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      if (!userData.email) throw new Error('Email is required');
      
      // Check if email already exists
      const emailExists = await checkEmailExists(userData.email);
      if (emailExists) {
        throw new Error('Email already in use. Please use a different email or log in.');
      }
      
      // For development, we'll create a mock successful signup
      if (import.meta.env.DEV) {
        // Add email to registered emails
        const updatedEmails = [...registeredEmails, userData.email];
        setRegisteredEmails(updatedEmails);
        localStorage.setItem(REGISTERED_EMAILS_KEY, JSON.stringify(updatedEmails));
        
        // Generate a mock user for development
        const mockUser: User = {
          id: 'dev-user-id',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
          dateOfBirth: userData.dateOfBirth || { month: '', day: '', year: '' },
          status: userData.status || 'Student',
          school: userData.school || '',
          profilePicture: userData.profilePicture || '',
          joinedDate: new Date().toISOString()
        };
        
        setCurrentUser(mockUser);
        // Save to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
        
        const code = generateVerificationCode();
        await sendVerificationEmail(userData.email, code);
        
        return { uid: 'dev-user-id' };
      }
      
      // In production, this would use the real Firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const user = userCredential.user;
      
      // Create user in the database
      try {
        await axios.post(`${API_URL}/users`, {
          id: user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          dateOfBirth: userData.dateOfBirth,
          status: userData.status || 'Student',
          school: userData.school,
          profilePicture: userData.profilePicture
        });
      } catch (error) {
        console.error('Error creating user in database:', error);
        // Continue anyway since Firebase auth is created
      }
      
      // Update display name in Firebase Auth
      if (userData.firstName && userData.lastName && auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: `${userData.firstName} ${userData.lastName}`
        });
      }
      
      const code = generateVerificationCode();
      await sendVerificationEmail(userData.email, code);
      
      return user;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        throw new Error('Email already in use. Please use a different email or log in.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create an account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (import.meta.env.DEV) {
        // For development, just clear the current user
        setCurrentUser(null);
        // Clear localStorage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }
      
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    if (code === verificationCode) {
      setVerificationCode(null);
      return true;
    }
    
    // For development, always return true for "123456"
    if (import.meta.env.DEV && code === "123456") {
      return true;
    }
    
    return false;
  };

  const updateProfile = async (data: Partial<User>, currentPassword: string) => {
    try {
      if (!currentUser) throw new Error('No user is logged in');
      
      if (import.meta.env.DEV) {
        // For development, just update the current user state
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        // Save to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
        return;
      }
      
      // In a real app, you would re-authenticate the user with the current password
      // For this demo, we'll skip that step
      
      // Update user in the database
      try {
        await axios.put(`${API_URL}/users/${currentUser.id}`, {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          status: data.status,
          school: data.school,
          profilePicture: data.profilePicture
        });
      } catch (error) {
        console.error('Error updating user in database:', error);
        // Continue anyway for development
      }
      
      // Update local state
      setCurrentUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...data };
        // Save to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      
      // If updating display name in Firebase Auth
      if (data.firstName && data.lastName && auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: `${data.firstName} ${data.lastName}`
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      
      // For development, still update the state even if Firebase fails
      if (import.meta.env.DEV) {
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        // Save to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
        return;
      }
      
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    verifyCode,
    updateProfile,
    checkEmailExists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};