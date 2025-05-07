import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Bell, Bookmark, Shield, HelpCircle, Info, Home, LogOut, Copy, Mail, Edit, Calendar, Check } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import DatePickerInput from '../components/DatePickerInput';

const Profile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
    dateOfBirth: {
      month: currentUser?.dateOfBirth?.month || '',
      day: currentUser?.dateOfBirth?.day || '',
      year: currentUser?.dateOfBirth?.year || ''
    },
    status: currentUser?.status || '',
    school: currentUser?.school || '',
    currentPassword: ''
  });
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(() => {
    // Try to create a date from the user's date of birth
    if (currentUser?.dateOfBirth?.year && currentUser?.dateOfBirth?.month && currentUser?.dateOfBirth?.day) {
      const monthIndex = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ].indexOf(currentUser.dateOfBirth.month);
      
      if (monthIndex !== -1) {
        return new Date(
          parseInt(currentUser.dateOfBirth.year),
          monthIndex,
          parseInt(currentUser.dateOfBirth.day)
        );
      }
    }
    return null;
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleBirthDateChange = (date: Date | null) => {
    setBirthDate(date);
    
    if (date) {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      setFormData(prev => ({
        ...prev,
        dateOfBirth: {
          month: months[date.getMonth()],
          day: date.getDate().toString(),
          year: date.getFullYear().toString()
        }
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword && !import.meta.env.DEV) {
      alert('Please enter your current password to save changes');
      return;
    }
    
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        status: formData.status,
        school: formData.school
      }, formData.currentPassword);
      
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert('Failed to update profile. Please check your password and try again.');
    }
  };
  
  const copyEmail = () => {
    navigator.clipboard.writeText(currentUser?.email || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-sidebar">
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ 
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '15px',
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'var(--primary-dark)'
            }}>
              {currentUser?.firstName?.[0] || 'D'}
            </div>
            <h3 style={{ fontWeight: '600' }}>My Profile</h3>
          </div>
          
          <ul className="profile-menu">
            <li className="profile-menu-item active">
              <User size={18} />
              <span>My Profile</span>
            </li>
            <li className="profile-menu-item">
              <MessageSquare size={18} />
              <span>Messages</span>
              <span className="profile-menu-badge">12</span>
            </li>
            <li className="profile-menu-item">
              <Bell size={18} />
              <span>Notifications</span>
              <span className="profile-menu-badge">2</span>
            </li>
            <li className="profile-menu-item">
              <Bookmark size={18} />
              <span>Saved Lists</span>
            </li>
          </ul>
          
          <div style={{ margin: '20px 0 10px', opacity: 0.6, fontSize: '14px' }}>
            Account Settings
          </div>
          
          <ul className="profile-menu">
            <li className="profile-menu-item">
              <Shield size={18} />
              <span>Privacy/Security</span>
            </li>
          </ul>
          
          <div style={{ margin: '20px 0 10px', opacity: 0.6, fontSize: '14px' }}>
            Support
          </div>
          
          <ul className="profile-menu">
            <li className="profile-menu-item">
              <HelpCircle size={18} />
              <span>Contact Us</span>
            </li>
            <li className="profile-menu-item">
              <Info size={18} />
              <span>About Us</span>
            </li>
            <li className="profile-menu-item">
              <Home size={18} />
              <span>Become a Host</span>
            </li>
            <li className="profile-menu-item">
              <HelpCircle size={18} />
              <span>Help Centre</span>
            </li>
          </ul>
          
          <button 
            onClick={() => logout()}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: '1px solid var(--error-color)',
              color: 'var(--error-color)',
              padding: '12px 20px',
              borderRadius: '30px',
              marginTop: '30px',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
        
        <div className="profile-main">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Hello, {currentUser?.firstName || 'User'}!
            </h2>
            <Link to="/" className="btn btn-secondary">
              Go back to Page
            </Link>
          </div>
          
          <p style={{ marginBottom: '30px' }}>
            Here's your overview of your profile!
          </p>
          
          <div className="profile-header">
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{ 
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'var(--primary-color)',
                overflow: 'hidden'
              }}>
                {currentUser?.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={`${currentUser.firstName} ${currentUser.lastName}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={50} />
                )}
              </div>
              
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <p style={{ opacity: 0.8 }}>
                  Joined {new Date(currentUser?.joinedDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="profile-form">
            <form onSubmit={handleSubmit}>
              <div className="profile-form-row">
                <div className="profile-form-col">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                
                <div className="profile-form-col">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-col">
                  <div className="form-group">
                    <label>Email</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        style={{ width: '100%' }}
                      />
                      <div style={{ 
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        gap: '10px'
                      }}>
                        <button
                          type="button"
                          onClick={copyEmail}
                          style={{ 
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'var(--primary-color)'
                          }}
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                        <a
                          href={`mailto:${formData.email}`}
                          style={{ 
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'var(--primary-color)'
                          }}
                        >
                          <Mail size={16} />
                          Send mail
                        </a>
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          style={{ 
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'var(--primary-color)'
                          }}
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="profile-form-col">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-col">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    {isEditing ? (
                      <DatePickerInput
                        selectedDate={birthDate}
                        onChange={handleBirthDateChange}
                        placeholder="Select your birth date"
                        maxDate={new Date()}
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                      }}>
                        <div style={{ 
                          background: 'var(--secondary-color)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <Calendar size={16} />
                          <span>{formData.dateOfBirth.month || 'Month'}</span>
                        </div>
                        <div style={{ 
                          background: 'var(--secondary-color)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          width: '60px',
                          textAlign: 'center'
                        }}>
                          {formData.dateOfBirth.day || 'Day'}
                        </div>
                        <div style={{ 
                          background: 'var(--secondary-color)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          width: '80px',
                          textAlign: 'center'
                        }}>
                          {formData.dateOfBirth.year || 'Year'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="profile-form-col">
                  <div className="form-group">
                    <label>Status</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                      >
                        <option value="Student">Student</option>
                        <option value="Tenant">Tenant</option>
                        <option value="Landlord">Landlord</option>
                      </select>
                    ) : (
                      <div style={{ 
                        background: 'var(--secondary-color)',
                        padding: '12px 16px',
                        borderRadius: '8px'
                      }}>
                        {formData.status || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-col">
                  <div className="form-group">
                    <label>School</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      disabled={!isEditing}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="profile-form-col">
                    <div className="form-group">
                      <label>Current Password {import.meta.env.DEV && "(not required in dev mode)"}</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder={import.meta.env.DEV ? "Not required in development mode" : "Enter current password to confirm changes"}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                </div>
              )}
              
              {saveSuccess && (
                <div className="success-message" style={{ textAlign: 'right', marginTop: '10px' }}>
                  Profile updated successfully!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;