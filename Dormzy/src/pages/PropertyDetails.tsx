import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Share2, Heart } from 'lucide-react';
import Header from '../components/Header';
import MessageModal from '../components/MessageModal';

// Mock data for the property
const mockProperty = {
  id: '1',
  title: '123 Kingston Road',
  location: 'Kingston, Ontario',
  price: 1000,
  bathrooms: 3,
  bedrooms: 4,
  type: 'Single',
  style: '2-Storey',
  age: 'N/A',
  added: 'Jan 23, 2025',
  updated: 'Jan 25, 2025',
  lease: {
    startDate: '2025-09-06',
    endDate: '2026-04-28'
  },
  images: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
  ],
  nearbyPlaces: [
    {
      title: '5 min walk to the school',
      description: 'This home is by Kingston'
    },
    {
      title: '1 min walk to the bus stop',
      description: 'Multiple bus stops around the house'
    },
    {
      title: '10 min walk to the grocery store',
      description: 'Plaza with multiple stores for necessities'
    }
  ],
  description: `Welcome to our lakefront vacation rental! Enjoy the full spectrum of morning golden hour colours in this premium waterfront villa on Lake Simcoe.

This premium house on a private road is situated in a quiet neighbourhood, which offers a peaceful environment for time well spent with a group of friends or large family gatherings.`,
  host: {
    name: 'Jane Doe',
    role: 'Landlord',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }
};

const PropertyDetails: React.FC = () => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <>
      <Header />
      <div className="property-details-container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <img 
            src={mockProperty.images[0]} 
            alt="Main view" 
            className="main-image"
          />
          <div className="secondary-images">
            {mockProperty.images.slice(1, 4).map((image, index) => (
              <div key={index} className="secondary-image-container">
                <img 
                  src={image} 
                  alt={`View ${index + 2}`} 
                  className="secondary-image"
                />
                {index === 2 && (
                  <div className="image-count">+7</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="property-header">
          <div>
            <h1>{mockProperty.title}</h1>
            <div className="location">{mockProperty.location}</div>
          </div>
          <div className="action-buttons">
            <button className="btn btn-secondary">
              <MapPin size={18} />
              View on Map
            </button>
            <button className="btn btn-secondary">
              <Share2 size={18} />
              Share
            </button>
            <button 
              className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              Save
            </button>
            <button className="btn btn-primary">Make an offer</button>
          </div>
        </div>

        <div className="content-grid">
          <div className="info-card">
            {/* Price and Stats */}
            <div className="price-section">
              <div className="price">${mockProperty.price}/mo</div>
              <div className="lease-status">For Lease • Added 2 days ago</div>
              <div className="stats">
                <div className="stat">
                  <div className="stat-value">{mockProperty.bathrooms}</div>
                  <div className="stat-label">Bathrooms</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{mockProperty.bedrooms}</div>
                  <div className="stat-label">Bedrooms</div>
                </div>
                <div className="availability-badge">
                  3 Bedrooms Available
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="metadata-grid">
              <div>
                <div className="metadata-row">
                  <span className="metadata-label">Type:</span>
                  <span className="metadata-value">{mockProperty.type}</span>
                </div>
                <div className="metadata-row">
                  <span className="metadata-label">Style:</span>
                  <span className="metadata-value">{mockProperty.style}</span>
                </div>
                <div className="metadata-row">
                  <span className="metadata-label">Age:</span>
                  <span className="metadata-value">{mockProperty.age}</span>
                </div>
                <div className="metadata-row">
                  <span className="metadata-label">Added:</span>
                  <span className="metadata-value">{mockProperty.added}</span>
                </div>
                <div className="metadata-row">
                  <span className="metadata-label">Updated:</span>
                  <span className="metadata-value">{mockProperty.updated}</span>
                </div>
              </div>
              <div className="lease-term">
                <h3>Lease Term</h3>
                <div className="lease-dates">
                  <div>Start Date: {mockProperty.lease.startDate}</div>
                  <div>End Date: {mockProperty.lease.endDate}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>Description</h2>
              <p>{mockProperty.description}</p>
              <button className="view-more">View More {'>'}</button>
            </div>

            {/* Nearby Places */}
            <div className="nearby-section">
              <h2>What this place offers</h2>
              <div className="nearby-places">
                {mockProperty.nearbyPlaces.map((place, index) => (
                  <div key={index} className="nearby-place">
                    <div className="nearby-icon"></div>
                    <div>
                      <div className="nearby-title">{place.title}</div>
                      <div className="nearby-description">{place.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Host Card */}
          <div className="host-card">
            <div className="host-info">
              <img 
                src={mockProperty.host.avatar} 
                alt={mockProperty.host.name} 
                className="host-avatar"
              />
              <div>
                <div className="posted-by">Posted By:</div>
                <div className="host-name">{mockProperty.host.name}</div>
                <div className="host-role">{mockProperty.host.role}</div>
              </div>
            </div>
            <button 
              className="btn btn-primary message-btn"
              onClick={() => setIsMessageModalOpen(true)}
            >
              Message
            </button>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipient={{
          id: 'host1',
          name: mockProperty.host.name,
          avatar: mockProperty.host.avatar
        }}
      />
    </>
  );
};

export default PropertyDetails;