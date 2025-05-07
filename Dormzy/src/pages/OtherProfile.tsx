import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Flag, ChevronLeft, ChevronRight, Shield, Heart } from 'lucide-react';
import Header from '../components/Header';
import { Property } from '../types';

// Mock user data
const mockUser = {
  id: 'user1',
  name: 'Jane Doe',
  email: 'janeDoe234@gmail.com',
  profilePicture: 'https://source.unsplash.com/random/100x100?portrait,1',
  joinedDate: 'January 2025',
  isVerified: true,
  about: 'Hi there! I\'m a student at University of Washington looking for housing options near campus. I love quiet spaces with good natural light and am a clean, respectful roommate.'
};

// Mock property listings
const mockListings: Property[] = [
  {
    id: '1',
    title: 'Warm semi-house',
    description: 'Cozy semi-house perfect for students',
    price: 950,
    location: {
      address: '123 Highland Ave, Toronto, ON K1A 0A9',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'K1A 0A9',
      coordinates: { lat: 47.6162, lng: -122.3421 }
    },
    bedrooms: 2,
    bathrooms: 1,
    size: 850,
    images: ['https://source.unsplash.com/random/600x400?house,2'],
    amenities: ['Wifi', 'Laundry'],
    hostId: 'host2',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02'
  },
  {
    id: '2',
    title: 'Big available room',
    description: 'Large room in a shared house',
    price: 750,
    location: {
      address: '456 Main St, Toronto, ON K1A 0A9',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'K1A 0A9',
      coordinates: { lat: 47.6262, lng: -122.3521 }
    },
    bedrooms: 1,
    bathrooms: 1,
    size: 300,
    images: ['https://source.unsplash.com/random/600x400?room,3'],
    amenities: ['Wifi', 'Kitchen'],
    hostId: 'host3',
    createdAt: '2023-01-03',
    updatedAt: '2023-01-03'
  },
  {
    id: '3',
    title: '1 Master Bed 3 Ba',
    description: 'Master bedroom with private bathroom',
    price: 1100,
    location: {
      address: '789 Bridge Way, Toronto, ON K1A 0A9',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'K1A 0A9',
      coordinates: { lat: 47.6362, lng: -122.3621 }
    },
    bedrooms: 1,
    bathrooms: 3,
    size: 400,
    images: ['https://source.unsplash.com/random/600x400?bedroom,4'],
    amenities: ['Wifi', 'Private Bath', 'Walk-in Closet'],
    hostId: 'host4',
    createdAt: '2023-01-04',
    updatedAt: '2023-01-04'
  },
  {
    id: '4',
    title: '4 room townhouse',
    description: 'Spacious townhouse near campus',
    price: 2200,
    location: {
      address: '101 College Dr, Toronto, ON K1A 0A9',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'K1A 0A9',
      coordinates: { lat: 47.6462, lng: -122.3721 }
    },
    bedrooms: 4,
    bathrooms: 3,
    size: 1800,
    images: ['https://source.unsplash.com/random/600x400?townhouse,5'],
    amenities: ['Wifi', 'Parking', 'Backyard', 'Washer/Dryer'],
    hostId: 'host5',
    createdAt: '2023-01-05',
    updatedAt: '2023-01-05'
  }
];

const OtherProfile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => {
      const maxPage = Math.ceil(mockListings.length / itemsPerPage) - 1;
      return Math.min(maxPage, prev + 1);
    });
  };
  
  const paginatedListings = mockListings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  const handleMessageClick = () => {
    navigate('/messages');
  };
  
  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '50px' }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <button 
            style={{ 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-light)'
            }}
          >
            <Flag size={16} />
            Report this profile
          </button>
          
          <div className="dropdown">
            <button 
              style={{ 
                background: 'var(--white)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '8px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              Go back to Page
            </button>
            <div className="dropdown-menu">
              <Link to="/" className="dropdown-item">Home</Link>
              <Link to="/houses" className="dropdown-item">Houses</Link>
              <Link to="/explore" className="dropdown-item">Platform</Link>
            </div>
          </div>
        </div>
        
        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
          marginBottom: '30px'
        }}>
          <div style={{ 
            background: 'var(--primary-light)',
            height: '100px',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              bottom: '-40px',
              left: '30px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '4px solid white'
            }}>
              <img 
                src={mockUser.profilePicture} 
                alt={mockUser.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div style={{ 
              position: 'absolute',
              top: '10px',
              right: '10px'
            }}>
              {mockUser.isVerified && (
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '20px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Shield size={14} />
                  Verified User
                </div>
              )}
            </div>
          </div>
          
          <div style={{ padding: '50px 30px 30px' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {mockUser.name}
                </h1>
                <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                  Joined {mockUser.joinedDate}
                </p>
              </div>
              
              <button 
                onClick={handleMessageClick}
                style={{ 
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={16} />
                Message
              </button>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                About me
              </h2>
              <p>
                {mockUser.about}
              </p>
            </div>
            
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                My Contacts
              </h2>
              <p>
                {mockUser.email}
              </p>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Jane's listings
            </h2>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handlePrevPage}
                style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              
              <button 
                onClick={handleNextPage}
                style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {paginatedListings.map((property) => (
              <div key={property.id} className="property-card" style={{ height: '100%' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    style={{ 
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px'
                    }}
                  />
                  <div style={{ 
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '5px'
                  }}>
                    <button style={{ 
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
                
                <div style={{ padding: '15px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '5px' }}>{property.title}</h3>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '5px'
                  }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px'
                    }}>
                      <span>{property.bedrooms} bd</span>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px'
                    }}>
                      <span>{property.bathrooms} ba</span>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px'
                    }}>
                      <span>{property.size} sqft</span>
                    </div>
                  </div>
                  
                  <p style={{ fontWeight: '700', color: 'var(--primary-color)', marginBottom: '5px' }}>
                    ${property.price} CAD / month
                  </p>
                  
                  <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                    {property.location.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherProfile;