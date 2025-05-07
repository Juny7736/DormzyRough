import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [displayCode, setDisplayCode] = useState<string | null>(null);
  const { login, verifyCode } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // For development, we'll display the verification code on screen
      // In production, this would be sent via email
      if (import.meta.env.DEV) {
        setDisplayCode('123456'); // Default development code
      }
      setIsVerifying(true);
    } catch (error: any) {
      setError(error.message || 'Failed to log in. Please check your credentials.');
    }
  };
  
  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };
  
  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    try {
      const isValid = await verifyCode(code);
      if (isValid) {
        navigate('/');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.');
    }
  };
  
  // Auto-fill the verification code if in development mode
  useEffect(() => {
    if (isVerifying && displayCode) {
      const codeArray = displayCode.split('');
      setVerificationCode(codeArray.concat(Array(6 - codeArray.length).fill('')));
    }
  }, [isVerifying, displayCode]);
  
  return (
    <div className="auth-container">
      <div className="auth-left">
        <Link to="/" className="logo">Dormzy</Link>
        
        {!isVerifying ? (
          <div className="auth-form">
            <h1>Login to Your Account</h1>
            
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
            
            {error && (
              <div className="error-message" style={{ 
                padding: '10px 15px', 
                background: 'rgba(255, 77, 77, 0.1)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <AlertCircle size={18} color="#ff4d4d" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div className="form-group">
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
               </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginBottom: '15px' 
              }}>
                <a href="#" style={{ color: 'var(--primary-color)', fontSize: '14px' }}>
                  Forgot Password?
                </a>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Sign In
              </button>
            </form>
          </div>
        ) : (
          <div className="auth-form">
            <h1>Verify Your Account</h1>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              We've sent a verification code to your email. Please enter the 6-digit code below.
            </p>
            
            {error && (
              <div className="error-message" style={{ 
                padding: '10px 15px', 
                background: 'rgba(255, 77, 77, 0.1)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <AlertCircle size={18} color="#ff4d4d" />
                <p>{error}</p>
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
                  <p>Use verification code: <strong>{displayCode}</strong></p>
                </div>
              </div>
            )}
            
            <div className="verification-code-container">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                  className="verification-code-input"
                />
              ))}
            </div>
            
            <button 
              onClick={handleVerifyCode} 
              className="btn btn-primary" 
              style={{ width: '100%' }}
            >
              Verify
            </button>
            
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Didn't receive the code? <a href="#" style={{ color: 'var(--primary-color)' }}>Resend</a>
            </p>
            
            <div style={{ 
              marginTop: '30px', 
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
                <p style={{ marginTop: '10px' }}>For testing purposes, you can use code: <strong>123456</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="auth-right">
        <div className="auth-right-content">
          <h2>New to Dormzy?</h2>
          <p style={{ margin: '20px 0' }}>
            Sign up and discover a great selections of houses for school!
          </p>
          <Link to="/signup" className="btn btn-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;