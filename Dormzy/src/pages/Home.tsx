import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import DatePickerInput from '../components/DatePickerInput';
import LocationAutocomplete from '../components/LocationAutocomplete';

const Home: React.FC = () => {
  const [location, setLocation] = useState('');
  const [moveDate, setMoveDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState('');

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold',
            color: 'var(--primary-color)',
            marginBottom: '20px'
          }}>
            Simplifying Student Housing
          </h1>
          <p style={{ 
            fontSize: '18px', 
            maxWidth: '600px',
            marginBottom: '30px'
          }}>
            Find your perfect student home away from home. Browse listings, connect with roommates, and secure your ideal campus housing.
          </p>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            boxShadow: 'var(--shadow)',
            padding: '20px',
            width: '100%',
            maxWidth: '800px'
          }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                flex: '1 1 200px'
              }}>
                <LocationAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder="Search by city, school..."
                />
              </div>
              
              <div style={{ 
                flex: '1 1 150px'
              }}>
                <DatePickerInput
                  selectedDate={moveDate}
                  onChange={setMoveDate}
                  placeholder="Move date"
                  minDate={new Date()}
                />
              </div>
              
              <div style={{ 
                flex: '1 1 150px',
                position: 'relative'
              }}>
                <Users size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{ 
                    width: '100%',
                    paddingLeft: '40px'
                  }}
                >
                  <option value="">Guests</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4+">4+ People</option>
                </select>
              </div>
              
              <button className="btn btn-primary" style={{ 
                flex: '0 0 50px',
                height: '50px',
                borderRadius: '50%',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search size={20} />
              </button>
            </div>
            
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <button className="btn btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                All Homes
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                Houses
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                Apartments
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                Condos
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                Townhouses
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Featured Properties</h2>
            <Link to="/houses" style={{ 
              display: 'flex',
              alignItems: 'center',
              color: 'var(--primary-color)',
              fontWeight: '500'
            }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="property-card">
                <div style={{ position: 'relative' }}>
                  <img 
                    src={`https://source.unsplash.com/random/300x200?house,${item}`} 
                    alt="Property" 
                    className="property-image" 
                  />
                </div>
                
                <div className="property-details">
                  <h3 className="property-title">
                    {item % 2 === 0 ? 'Cozy Studio Apartment' : 'Spacious 2-Bedroom House'}
                  </h3>
                  <p className="property-price">${600 + (item * 100)}/month</p>
                  
                  <div className="property-meta">
                    <div className="property-meta-item">
                      <span>{item % 2 === 0 ? '1' : '2'} bd</span>
                    </div>
                    <div className="property-meta-item">
                      <span>{item % 3 === 0 ? '2' : '1'} ba</span>
                    </div>
                    <div className="property-meta-item">
                      <span>{500 + (item * 100)} sqft</span>
                    </div>
                  </div>
                  
                  <div className="property-location">
                    <span>University District, Seattle, WA</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ 
          background: 'var(--primary-color)',
          borderRadius: '12px',
          padding: '40px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
            Experience it on the Go - Download the Mobile App!
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
            Get instant notifications, chat with hosts, and browse listings on the go with our mobile app.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <a href="#" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="App Store" width="24" height="24" />
              App Store
            </a>
            <a href="#" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" width="24" height="24" />
              Google Play
            </a>
          </div>
        </div>
        
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
            How It Works
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginTop: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Search size={32} color="var(--primary-dark)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Search
              </h3>
              <p>
                Browse thousands of student-friendly properties near your campus.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Calendar size={32} color="var(--primary-dark)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Book
              </h3>
              <p>
                Schedule viewings and secure your perfect student housing with ease.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Users size={32} color="var(--primary-dark)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                Connect
              </h3>
              <p>
                Find roommates, join communities, and make your student housing experience amazing.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer style={{ 
        background: 'var(--white)',
        padding: '40px 0',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '30px',
            justifyContent: 'space-between',
            marginBottom: '30px'
          }}>
            <div style={{ flex: '1 1 250px' }}>
              <h3 className="logo" style={{ marginBottom: '15px' }}>Dormzy</h3>
              <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
                Simplifying student housing for campuses nationwide.
              </p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <a href="#" style={{ 
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--secondary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="18" height="18" />
                </a>
                <a href="#" style={{ 
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--secondary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" alt="Twitter" width="18" height="18" />
                </a>
                <a href="#" style={{ 
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--secondary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="18" height="18" />
                </a>
              </div>
            </div>
            
            <div style={{ flex: '1 1 150px' }}>
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Company</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '10px' }}><Link to="/about">About Us</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/contact">Contact Us</Link></li>
                <li style={{ marginBottom: '10px' }}><a href="#">Careers</a></li>
                <li style={{ marginBottom: '10px' }}><a href="#">Blog</a></li>
              </ul>
            </div>
            
            <div style={{ flex: '1 1 150px' }}>
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Support</h4>
              <ul style={{ listStyle: 'none' }}>
                <li style={{ marginBottom: '10px' }}><Link to="/help">Help Center</Link></li>
                <li style={{ marginBottom: '10px' }}><a href="#">Safety Center</a></li>
                <li style={{ marginBottom: '10px' }}><a href="#">Community Guidelines</a></li>
                <li style={{ marginBottom: '10px' }}><a href="#">COVID-19 Resources</a></li>
              </ul>
            </div>
            
            <div style={{ flex: '1 1 250px' }}>
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Stay Updated</h4>
              <p style={{ color: 'var(--text-light)', marginBottom: '15px' }}>
                Subscribe to our newsletter for the latest housing options and student deals.
              </p>
              <div style={{ display: 'flex' }}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  style={{ 
                    flex: '1',
                    borderTopRightRadius: '0',
                    borderBottomRightRadius: '0'
                  }}
                />
                <button className="btn btn-primary" style={{ 
                  borderTopLeftRadius: '0',
                  borderBottomLeftRadius: '0',
                  padding: '12px 20px'
                }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ 
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
              © 2025 Dormzy, Inc. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '14px' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '14px' }}>Terms of Service</a>
              <a href="#" style={{ color: 'var(--text-light)', fontSize: '14px' }}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;