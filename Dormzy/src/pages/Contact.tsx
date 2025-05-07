import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '../components/Header';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real app, you would send this data to a server
      // For this demo, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Header />
      <div className="container contact-container">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Have questions or need assistance? We're here to help! Reach out to our team using the form below or through our contact information.
        </p>
        
        <div className="contact-row">
          <div className="contact-col">
            <div className="contact-form-card">
              <h2 className="contact-form-title">Send Us a Message</h2>
              
              {submitSuccess && (
                <div className="success-alert">
                  Your message has been sent successfully! We'll get back to you soon.
                </div>
              )}
              
              {submitError && (
                <div className="error-alert">
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Listing Issue">Listing Issue</option>
                    <option value="Account Help">Account Help</option>
                    <option value="Report a Problem">Report a Problem</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="contact-textarea"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="contact-col">
            <div className="contact-info-card">
              <div>
                <h2 className="contact-info-title">Contact Information</h2>
                <p className="contact-info-text">
                  Feel free to reach out to us using any of the following methods. Our support team is available Monday through Friday, 9 AM to 5 PM.
                </p>
                
                <div className="contact-method">
                  <Mail size={24} className="contact-method-icon" />
                  <div>
                    <h3 className="contact-method-title">Email Us</h3>
                    <p>
                      <a href="mailto:handaniel@gmail.com" className="contact-method-link">
                        handaniel@gmail.com
                      </a>
                    </p>
                    <p className="contact-method-note">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <Phone size={24} className="contact-method-icon" />
                  <div>
                    <h3 className="contact-method-title">Call Us</h3>
                    <p>
                      <a href="tel:+1234567890" className="contact-method-link">
                        (123) 456-7890
                      </a>
                    </p>
                    <p className="contact-method-note">
                      Mon-Fri, 9 AM - 5 PM
                    </p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <MapPin size={24} className="contact-method-icon" />
                  <div>
                    <h3 className="contact-method-title">Visit Us</h3>
                    <p>
                      123 Campus Drive<br />
                      University District<br />
                      Seattle, WA 98105
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <h3 className="social-links-title">Connect With Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="20" height="20" />
                  </a>
                  <a href="#" className="social-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" alt="Twitter" width="20" height="20" />
                  </a>
                  <a href="#" className="social-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" />
                  </a>
                  <a href="#" className="social-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          
          <div className="faq-container">
            {[
              {
                question: 'How do I create an account?',
                answer: 'To create an account, click on the "Sign Up" button in the top right corner of the homepage. Follow the prompts to enter your information and verify your email address.'
              },
              {
                question: 'Is there a fee to use Dormzy?',
                answer: 'No, Dormzy is completely free for students to use. We do not charge any fees for browsing listings, contacting hosts, or creating an account.'
              },
              {
                question: 'How do I list my property on Dormzy?',
                answer: 'To list your property, you need to create an account and then click on "Become a Host" in the menu. Follow the step-by-step process to add your property details, photos, and availability.'
              },
              {
                question: 'Is my personal information secure?',
                answer: 'Yes, we take data security very seriously. We use industry-standard encryption and security measures to protect your personal information. You can review our Privacy Policy for more details.'
              },
              {
                question: 'How can I report a suspicious listing?',
                answer: 'If you come across a suspicious listing, please click the "Report" button on the listing page or contact our support team directly through this contact form.'
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className={`faq-item ${index < 4 ? 'faq-item-border' : ''}`}
              >
                <h3 className="faq-question">
                  {faq.question}
                </h3>
                <p>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;