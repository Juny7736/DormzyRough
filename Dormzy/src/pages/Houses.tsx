import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Users, ChevronRight, Filter, Grid, Map as MapIcon } from 'lucide-react';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import DatePickerInput from '../components/DatePickerInput';
import LocationAutocomplete from '../components/LocationAutocomplete';

const mockProperties = [
  {
    id: '1',
    title: 'Modern Studio Near Campus',
    description: 'Bright and spacious studio apartment perfect for students',
    price: 1200,
    location: {
      address: '123 University Ave',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    bedrooms: 1,
    bathrooms: 1,
    size: 500,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
    ],
    amenities: ['WiFi', 'Air Conditioning', 'In-unit Laundry'],
    hostId: 'host1',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: '2',
    title: 'Cozy 2-Bedroom Apartment',
    description: 'Charming apartment with great natural light',
    price: 1800,
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
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
    ],
    amenities: ['Parking', 'Dishwasher', 'Pet Friendly'],
    hostId: 'host2',
    createdAt: '2023-01-02',
    updatedAt: '2023-01-02'
  },
  {
    id: '3',
    title: 'Luxury Student Living',
    description: 'High-end apartment with amazing amenities',
    price: 2200,
    location: {
      address: '789 Dorm Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
      coordinates: { lat: 47.6262, lng: -122.3521 }
    },
    bedrooms: 3,
    bathrooms: 2,
    size: 1200,
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
    ],
    amenities: ['Gym', 'Pool', 'Study Room'],
    hostId: 'host3',
    createdAt: '2023-01-03',
    updatedAt: '2023-01-03'
  },
  {
    id: '4',
    title: 'Private Room in Shared House',
    description: 'Furnished room in a friendly student house',
    price: 800,
    location: {
      address: '101 Campus Circle',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
      coordinates: { lat: 47.6362, lng: -122.3621 }
    },
    bedrooms: 1,
    bathrooms: 1,
    size: 200,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1617104666169-d81e613069b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
    ],
    amenities: ['Furnished', 'WiFi', 'Shared Kitchen'],
    hostId: 'host4',
    createdAt: '2023-01-04',
    updatedAt: '2023-01-04'
  },
  {
    id: '5',
    title: 'Modern Townhouse',
    description: 'Newly renovated townhouse perfect for roommates',
    price: 2500,
    location: {
      address: '202 Student Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
      coordinates: { lat: 47.6462, lng: -122.3721 }
    },
    bedrooms: 4,
    bathrooms: 2.5,
    size: 1800,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
    ],
    amenities: ['Garage', 'Backyard', 'Smart Home'],
    hostId: 'host5',
    createdAt: '2023-01-05',
    updatedAt: '2023-01-05'
  },
  {
    id: '6',
    title: 'Eco-Friendly Micro Studio',
    description: 'Sustainable living in the heart of campus',
    price: 950,
    location: {
      address: '303 Green Ave',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98105',
      coordinates: { lat: 47.6562, lng: -122.3821 }
    },
    bedrooms: 1,
    bathrooms: 1,
    size: 300,
    images: [
      'https://images.unsplash.com/photo-1622866306950-81d17097d458?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
    ],
    amenities: ['Solar Panels', 'Bike Storage', 'Recycling'],
    hostId: 'host6',
    createdAt: '2023-01-06',
    updatedAt: '2023-01-06'
  }
];

const Houses: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [location, setLocation] = useState('');
  const [moveDate, setMoveDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string | null>(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    'Wifi': false,
    'Parking': false,
    'Laundry': false,
    'Gym': false,
    'Pet Friendly': false,
    'Furnished': false
  });
  const [distance, setDistance] = useState('');
  
  const handleAmenityChange = (amenity: string) => {
    setAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity]
    }));
  };
  
  const handleBedroomSelect = (value: string) => {
    setSelectedBedrooms(selectedBedrooms === value ? null : value);
  };
  
  const handleBathroomSelect = (value: string) => {
    setSelectedBathrooms(selectedBathrooms === value ? null : value);
  };
  
  const handleLocationSelect = (locationData: { address: string; city: string; state: string; zipCode: string }) => {
    console.log('Selected location:', locationData);
    // You could use this data to filter properties or update the map view
  };
  
  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px',
          boxShadow: 'var(--shadow)',
          padding: '20px',
          marginBottom: '30px'
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
                onSelect={handleLocationSelect}
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
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
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
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px' }}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px' }}
                onClick={() => setViewMode('map')}
              >
                <MapIcon size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            flex: '0 0 250px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow)',
            height: 'fit-content'
          }}>
            <h3 style={{ fontWeight: '600', marginBottom: '20px' }}>Filters</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '10px' }}>Price Range</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ flex: 1 }} 
                />
                <span style={{ alignSelf: 'center' }}>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ flex: 1 }} 
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '10px' }}>Bedrooms</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1, 2, 3, 4, '5+'].map((num) => (
                  <button 
                    key={num} 
                    className={`btn ${selectedBedrooms === num.toString() ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ 
                      flex: 1, 
                      padding: '8px 0',
                      fontSize: '14px'
                    }}
                    onClick={() => handleBedroomSelect(num.toString())}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '10px' }}>Bathrooms</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1, 2, 3, '4+'].map((num) => (
                  <button 
                    key={num} 
                    className={`btn ${selectedBathrooms === num.toString() ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ 
                      flex: 1, 
                      padding: '8px 0',
                      fontSize: '14px'
                    }}
                    onClick={() => handleBathroomSelect(num.toString())}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '10px' }}>Move-in Date</h4>
              <DatePickerInput
                selectedDate={moveDate}
                onChange={setMoveDate}
                placeholder="Select move-in date"
                minDate={new Date()}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '10px' }}>Amenities</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.keys(amenities).map((amenity) => (
                  <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      checked={amenities[amenity]}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '10px' }}>Distance from Campus</h4>
              <select 
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Any distance</option>
                <option value="0.5">Less than 0.5 miles</option>
                <option value="1">Less than 1 mile</option>
                <option value="2">Less than 2 miles</option>
                <option value="5">Less than 5 miles</option>
              </select>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Apply Filters
            </button>
          </div>
          
          <div style={{ flex: 1 }}>
            {viewMode === 'grid' ? (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {mockProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div style={{ 
                background: 'var(--secondary-color)',
                height: '600px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p>Map View Coming Soon</p>
              </div>
            )}
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px'
            }}>
              <button className="btn btn-primary">
                Continue to explore more spaces
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Houses;