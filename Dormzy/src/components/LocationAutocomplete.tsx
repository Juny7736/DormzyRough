import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader } from 'lucide-react';
import axios from 'axios';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (location: { address: string; city: string; state: string; zipCode: string }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface Suggestion {
  id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Mock suggestions for development
const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    description: 'University of Washington, Seattle, WA, USA',
    structured_formatting: {
      main_text: 'University of Washington',
      secondary_text: 'Seattle, WA, USA'
    }
  },
  {
    id: '2',
    description: 'University District, Seattle, WA, USA',
    structured_formatting: {
      main_text: 'University District',
      secondary_text: 'Seattle, WA, USA'
    }
  },
  {
    id: '3',
    description: 'University Village, Seattle, WA, USA',
    structured_formatting: {
      main_text: 'University Village',
      secondary_text: 'Seattle, WA, USA'
    }
  },
  {
    id: '4',
    description: 'University of California, Berkeley, CA, USA',
    structured_formatting: {
      main_text: 'University of California',
      secondary_text: 'Berkeley, CA, USA'
    }
  },
  {
    id: '5',
    description: 'University of California, Los Angeles, CA, USA',
    structured_formatting: {
      main_text: 'University of California',
      secondary_text: 'Los Angeles, CA, USA'
    }
  },
  {
    id: '6',
    description: 'New York University, New York, NY, USA',
    structured_formatting: {
      main_text: 'New York University',
      secondary_text: 'New York, NY, USA'
    }
  },
  {
    id: '7',
    description: 'Boston University, Boston, MA, USA',
    structured_formatting: {
      main_text: 'Boston University',
      secondary_text: 'Boston, MA, USA'
    }
  },
  {
    id: '8',
    description: 'University of Michigan, Ann Arbor, MI, USA',
    structured_formatting: {
      main_text: 'University of Michigan',
      secondary_text: 'Ann Arbor, MI, USA'
    }
  }
];

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search by city, school...',
  disabled = false,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Function to fetch suggestions from Google Places API
  // In development, we'll use mock data
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      // In development, use mock data
      if (import.meta.env.DEV) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Filter mock suggestions based on query
        const filteredSuggestions = MOCK_SUGGESTIONS.filter(suggestion => 
          suggestion.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setSuggestions(filteredSuggestions);
        setIsLoading(false);
        return;
      }

      // In production, would use Google Places API
      // This is just a placeholder for the real implementation
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            types: '(cities)',
            key: 'YOUR_API_KEY' // Would be replaced with actual API key
          }
        }
      );

      setSuggestions(response.data.predictions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      // Fallback to mock data in case of error
      const filteredSuggestions = MOCK_SUGGESTIONS.filter(suggestion => 
        suggestion.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function to limit API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.description);
    setIsFocused(false);
    setSuggestions([]);

    if (onSelect) {
      // Parse the address components
      // In a real implementation, you would use Google's Place Details API
      const addressParts = suggestion.description.split(', ');
      const location = {
        address: addressParts[0],
        city: addressParts[1] || '',
        state: addressParts[2]?.split(' ')[0] || '',
        zipCode: addressParts[2]?.split(' ')[1] || ''
      };
      
      onSelect(location);
    }
  };

  return (
    <div className={`location-autocomplete ${className}`} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <MapPin 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-light)' 
          }} 
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          style={{ 
            width: '100%',
            paddingLeft: '40px',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.7 : 1,
            background: disabled ? 'var(--secondary-color)' : 'white'
          }}
        />
        {isLoading && (
          <div style={{ 
            position: 'absolute', 
            right: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-light)' 
          }}>
            <Loader size={18} className="animate-spin" />
          </div>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '8px',
            boxShadow: 'var(--shadow)',
            zIndex: 10,
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-color)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ fontWeight: '500' }}>
                {suggestion.structured_formatting.main_text}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;