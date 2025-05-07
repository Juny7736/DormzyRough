import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Info, Check, X, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DatePickerInput from '../components/DatePickerInput';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    school: '',
    status: 'Student'
  });
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayCode, setDisplayCode] = useState<string | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  const { signup, checkEmailExists } = useAuth();
  const navigate = useNavigate();
  
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
      
      // Check email existence when typing
      if (name === 'email' && value.includes('@') && value.includes('.')) {
        checkEmailAvailability(value);
      }
      
      // Check password strength
      if (name === 'password') {
        checkPasswordStrength(value);
      }
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
  
  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@') || !email.includes('.')) return;
    
    setEmailChecking(true);
    try {
      const exists = await checkEmailExists(email);
      setEmailExists(exists);
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setEmailChecking(false);
    }
  };
  
  const checkPasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate score (0-4)
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    
    // Normalize score to 0-4 range
    score = Math.min(4, Math.floor(score * 0.8));
    
    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    });
  };
  
  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (emailExists) {
      return setError('Email already in use. Please use a different email or log in.');
    }
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    
    if (passwordStrength.score < 3) {
      return setError('Please create a stronger password');
    }
    
    setStep(2);
  };
  
  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await signup(formData, formData.password);
      
      // For development, we'll display the verification code on screen
      if (import.meta.env.DEV) {
        setDisplayCode('123456'); // Default development code
      }
      
      setSuccess('Account created successfully! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to create an account. Please try again.');
    }
  };
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  
  // Get password strength color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0: return '#ff4d4d'; // Very weak (red)
      case 1: return '#ff9933'; // Weak (orange)
      case 2: return '#ffcc00'; // Medium (yellow)
      case 3: return '#99cc33'; // Strong (light green)
      case 4: return '#33cc33'; // Very strong (green)
      default: return '#ccc';
    }
  };
  
  // Get password strength text
  const getPasswordStrengthText = () => {
    switch (passwordStrength.score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };
  
  return (
    <div className="auth-container">
      {step === 1 ? (
        <div className="auth-right">
          <div className="auth-right-content">
            <h2>Already have an account?</h2>
            <p style={{ margin: '20px 0' }}>
              If you already have an account, just sign in. We've missed you!
            </p>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      ) : null}
      
      <div className={step === 1 ? "auth-left" : "auth-container"} style={{ padding: '40px' }}>
        <Link to="/" className="logo">Dormzy</Link>
        
        <div className="auth-form">
          <h1>{step === 1 ? 'Create Free Account' : 'Complete Your Profile'}</h1>
          
          {step === 1 && (
            <>
              <div className="social-login">
                <button className="social-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="24" height="24" />
                </button>
                <button className="social-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" width="24" height="24" />
                </button>
                <button className="social-btn">
                  <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" alt="Twitter" width="24" height="24" />
                </button>
              </div>
              
              <div className="auth-divider">
                <span>or</span>
              </div>
            </>
          )}
          
          {error && (
            <div className="error-message" style={{ 
              padding: '10px 15px', 
              background: 'rgba(255, 77, 77, 0.1)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={18} color="#ff4d4d" />
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="success-message" style={{ 
              padding: '10px 15px', 
              background: 'rgba(51, 204, 51, 0.1)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <Check size={18} color="#33cc33" />
              <p>{success}</p>
            </div>
          )}
          
          {displayCode && (
            <div style={{ 
              background: 'var(--primary-light)', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Info size={20} />
              <div>
                <p style={{ fontWeight: 'bold' }}>Development Mode</p>
                <p>Account created! Use verification code: <strong>{displayCode}</strong> when logging in.</p>
              </div>
            </div>
          )}
          
          {step === 1 ? (
            <form onSubmit={handleSubmitStep1}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              
              <div className="form-group" style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%',
                    borderColor: emailExists ? 'var(--error-color)' : formData.email && !emailChecking && !emailExists ? 'var(--success-color)' : ''
                  }}
                />
                {formData.email && !emailChecking && (
                  <div style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)'
                  }}>
                    {emailExists ? (
                      <X size={18} color="var(--error-color)" />
                    ) : (
                      <Check size={18} color="var(--success-color)" />
                    )}
                  </div>
                )}
                {emailExists && (
                  <p style={{ 
                    color: 'var(--error-color)', 
                    fontSize: '12px', 
                    marginTop: '5px' 
                  }}>
                    Email already in use. Please use a different email or log in.
                  </p>
                )}
              </div>
              
              <div className="form-group">
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ width: '100%' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {formData.password && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '14px' }}>Password strength:</span>
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: getPasswordStrengthColor()
                      }}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    
                    <div style={{ 
                      height: '4px', 
                      background: '#eee', 
                      borderRadius: '2px',
                      overflow: 'hidden',
                      marginBottom: '10px'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${(passwordStrength.score / 4) * 100}%`,
                        background: getPasswordStrengthColor(),
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: passwordStrength.hasMinLength ? 'rgba(51, 204, 51, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                        color: passwordStrength.hasMinLength ? 'var(--success-color)' : 'var(--error-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {passwordStrength.hasMinLength ? (
                          <Check size={12} />
                        ) : (
                          <X size={12} />
                        )}
                        8+ characters
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: passwordStrength.hasUppercase ? 'rgba(51, 204, 51, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                        color: passwordStrength.hasUppercase ? 'var(--success-color)' : 'var(--error-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {passwordStrength.hasUppercase ? (
                          <Check size={12} />
                        ) : (
                          <X size={12} />
                        )}
                        Uppercase
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: passwordStrength.hasLowercase ? 'rgba(51, 204, 51, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                        color: passwordStrength.hasLowercase ? 'var(--success-color)' : 'var(--error-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {passwordStrength.hasLowercase ? (
                          <Check size={12} />
                        ) : (
                          <X size={12} />
                        )}
                        Lowercase
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: passwordStrength.hasNumber ? 'rgba(51, 204, 51, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                        color: passwordStrength.hasNumber ? 'var(--success-color)' : 'var(--error-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {passwordStrength.hasNumber ? (
                          <Check size={12} />
                        ) : (
                          <X size={12} />
                        )}
                        Number
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: passwordStrength.hasSpecialChar ? 'rgba(51, 204, 51, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                        color: passwordStrength.hasSpecialChar ? 'var(--success-color)' : 'var(--error-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {passwordStrength.hasSpecialChar ? (
                          <Check size={12} />
                        ) : (
                          <X size={12} />
                        )}
                        Special character
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ 
                    width: '100%',
                    borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? 'var(--error-color)' : ''
                  }}
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p style={{ 
                    color: 'var(--error-color)', 
                    fontSize: '12px', 
                    marginTop: '5px' 
                  }}>
                    Passwords do not match
                  </p>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  required
                  style={{ marginRight: '10px' }}
                />
                <label htmlFor="terms" style={{ fontSize: '14px' }}>
                  I have read the <a href="#" style={{ color: 'var(--primary-color)' }}>Terms & Conditions</a>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={emailExists || (formData.password !== formData.confirmPassword && formData.confirmPassword !== '')}
              >
                Sign Up
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitStep2}>
              <div className="form-group">
                <label>Date of Birth</label>
                <DatePickerInput
                  selectedDate={birthDate}
                  onChange={handleBirthDateChange}
                  placeholder="Select your birth date"
                  maxDate={new Date()}
                />
              </div>
              
              <div className="form-group">
                <label>School</label>
                <input
                  type="text"
                  name="school"
                  placeholder="Enter your school name"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="Student">Student</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Landlord">Landlord</option>
                </select>
              </div>
              
              <div style={{ 
                marginBottom: '20px', 
                background: 'var(--secondary-color)', 
                padding: '15px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertCircle size={20} style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: 'bold' }}>Note:</p>
                  <p>In this demo version, email verification is simulated. In a production environment, you would receive an actual email with the verification code.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Complete
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;