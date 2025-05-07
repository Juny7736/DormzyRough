import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Home, X } from 'lucide-react';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';

interface MapMarkerProps {
  lat: number;
  lng: number;
  property: Property;
  onClick: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ property, onClick }) => {
  return (
    <div className="map-marker" onClick={onClick}>
      <Home size={16} />
    </div>
  );
};

const mockProperties = [
  {
    id: '1',
    title: 'Huge room condo',
    description: 'A spacious condo with great amenities',
    price: 1200,
    location: {
      address: '123 University Ave',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    bedrooms: 3,
    bathrooms: 2,
    size: 1200,
    images: ['https://source.unsplash.com/random/600x400?apartment,1'],
    amenities: ['Wifi', 'Parking', 'Gym'],
    hostId: 'host1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: '2',
    title: 'Warm semi-house',
    description: 'Cozy semi-house perfect for students',
    price: 950,
    location: {
      address: '456 College St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
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
    id: '3',
    title: 'Big available room',
    description: 'Large room in a shared house',
    price: 750,
    location: {
      address: '789 Dorm Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
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
    id: '4',
    title: '1 Master Bed 2 ba',
    description: 'Master bedroom with private bathroom',
    price: 1100,
    location: {
      address: '101 Campus Circle',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
      coordinates: { lat: 47.6362, lng: -122.3621 }
    },
    bedrooms: 1,
    bathrooms: 2,
    size: 400,
    images: ['https://source.unsplash.com/random/600x400?bedroom,4'],
    amenities: ['Wifi', 'Private Bath', 'Walk-in Closet'],
    hostId: 'host4',
    createdAt: '2023-01-04',
    updatedAt: '2023-01-04'
  },
  {
    id: '5',
    title: '4 room townhouse',
    description: 'Spacious townhouse near campus',
    price: 2200,
    location: {
      address: '202 Student Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
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

const MapView: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const defaultProps = {
    center: {
      lat: 47.6062,
      lng: -122.3321
    },
    zoom: 13
  };
  
  return (
    <>
      <Header />
      <div className="map-container">
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }} // You would add your Google Maps API key here
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {mockProperties.map((property) => (
            <MapMarker
              key={property.id}
              lat={property.location.coordinates.lat}
              lng={property.location.coordinates.lng}
              property={property}
              onClick={() => setSelectedProperty(property)}
            />
          ))}
        </GoogleMapReact>
        
        {selectedProperty && (
          <div className="map-sidebar">
            <div className="map-sidebar-header">
              <h3 className="map-sidebar-title">Property Details</h3>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="map-sidebar-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="map-sidebar-content">
              <PropertyCard property={selectedProperty} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MapView;