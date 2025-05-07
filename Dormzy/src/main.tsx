import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';
import './styles/components/CommentModal.css';
import './styles/components/DatePicker.css';
import './styles/components/Header.css';
import './styles/components/MessageModal.css';
import './styles/components/PropertyCard.css';
import './styles/components/SearchBar.css';
import './styles/pages/Contact.css';
import './styles/pages/Explore.css';
import './styles/pages/Home.css';
import './styles/pages/Houses.css';
import './styles/pages/Login.css';
import './styles/pages/MapView.css';
import './styles/pages/Messages.css';
import './styles/pages/OtherProfile.css';
import './styles/pages/Profile.css';
import './styles/pages/PropertyDetails.css';
import './styles/pages/Signup.css';
import './styles/pages/UploadListing.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);