import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="property-card">
      <div className="property-image-container">
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.title}
          className="property-image"
        />
        {property.images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.preventDefault(); prevImage(); }}
              className="property-image-nav property-image-nav-left"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); nextImage(); }}
              className="property-image-nav property-image-nav-right"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="property-image-dots">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.preventDefault(); setCurrentImageIndex(index); }}
                  className={`property-image-dot ${index === currentImageIndex ? 'active' : ''}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <button 
          onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
          className={`property-favorite ${isLiked ? 'liked' : ''}`}
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="property-details">
        <Link to={`/houses/${property.id}`}>
          <h3 className="property-title">{property.title}</h3>
        </Link>
        <p className="property-price">${property.price.toLocaleString()}/month</p>
        
        <div className="property-meta">
          <div className="property-meta-item">
            <Bed size={18} />
            <span>{property.bedrooms} bd</span>
          </div>
          <div className="property-meta-item">
            <Bath size={18} />
            <span>{property.bathrooms} ba</span>
          </div>
          <div className="property-meta-item">
            <Square size={18} />
            <span>{property.size} sqft</span>
          </div>
        </div>
        
        <div className="property-amenities">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="property-amenity">
              {amenity}
            </span>
          ))}
        </div>
        
        <div className="property-location">
          <MapPin size={16} />
          <span>{property.location.address}, {property.location.city}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;