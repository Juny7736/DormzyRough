import React, { useState } from 'react';
import { Upload, X, MapPin, Zap, Info, Calendar } from 'lucide-react';
import Header from '../components/Header';
import LocationAutocomplete from '../components/LocationAutocomplete';
import DatePickerInput from '../components/DatePickerInput';

type Step = 'address' | 'utilities' | 'images' | 'basic-info' | 'date';

interface FormData {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  utilities: {
    electricity: boolean;
    water: boolean;
    gas: boolean;
    internet: boolean;
    heating: boolean;
    cooling: boolean;
  };
  images: File[];
  basicInfo: {
    title: string;
    description: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    size: string;
  };
  date: {
    availableFrom: Date | null;
    availableTo: Date | null;
  };
}

const UploadListing: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    utilities: {
      electricity: false,
      water: false,
      gas: false,
      internet: false,
      heating: false,
      cooling: false
    },
    images: [],
    basicInfo: {
      title: '',
      description: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      size: ''
    },
    date: {
      availableFrom: null,
      availableTo: null
    }
  });

  const steps: { id: Step; label: string }[] = [
    { id: 'address', label: 'Address' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'images', label: 'Images' },
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'date', label: 'Date' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageFiles]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...selectedFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleLocationSelect = (location: { address: string; city: string; state: string; zipCode: string }) => {
    setFormData(prev => ({
      ...prev,
      address: location
    }));
  };

  const handleUtilityToggle = (utility: keyof FormData['utilities']) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utility]: !prev.utilities[utility]
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value
      }
    }));
  };

  const handleDateChange = (field: 'availableFrom' | 'availableTo', date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      date: {
        ...prev.date,
        [field]: date
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'address':
        return (
          <div className="step-content">
            <LocationAutocomplete
              value={formData.address.street}
              onChange={(value) => handleInputChange({ 
                target: { name: 'address.street', value } 
              } as React.ChangeEvent<HTMLInputElement>)}
              onSelect={handleLocationSelect}
              placeholder="Enter your address"
            />
          </div>
        );

      case 'utilities':
        return (
          <div className="step-content">
            <div className="utilities-grid">
              {Object.entries(formData.utilities).map(([utility, included]) => (
                <button
                  key={utility}
                  className={`utility-button ${included ? 'active' : ''}`}
                  onClick={() => handleUtilityToggle(utility as keyof FormData['utilities'])}
                >
                  <Zap size={18} />
                  {utility.charAt(0).toUpperCase() + utility.slice(1)}
                </button>
              ))}
            </div>
          </div>
        );

      case 'images':
        return (
          <div className="step-content">
            <div 
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-content">
                <Upload size={48} className="upload-icon" />
                <h3>Upload Images</h3>
                <p>Select files or drag here</p>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden-input"
                />
                <label htmlFor="file-upload" className="select-button">
                  Select a File
                </label>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="preview-area">
                {formData.images.map((file, index) => (
                  <div key={index} className="preview-item">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <button 
                      className="remove-button"
                      onClick={() => removeFile(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'basic-info':
        return (
          <div className="step-content">
            <div className="form-group">
              <input
                type="text"
                name="basicInfo.title"
                value={formData.basicInfo.title}
                onChange={handleInputChange}
                placeholder="Title"
              />
            </div>
            
            <div className="form-group">
              <textarea
                name="basicInfo.description"
                value={formData.basicInfo.description}
                onChange={handleInputChange}
                placeholder="Description"
                rows={4}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  name="basicInfo.price"
                  value={formData.basicInfo.price}
                  onChange={handleInputChange}
                  placeholder="Price per month"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  name="basicInfo.bedrooms"
                  value={formData.basicInfo.bedrooms}
                  onChange={handleInputChange}
                  placeholder="Bedrooms"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  name="basicInfo.bathrooms"
                  value={formData.basicInfo.bathrooms}
                  onChange={handleInputChange}
                  placeholder="Bathrooms"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="number"
                  name="basicInfo.size"
                  value={formData.basicInfo.size}
                  onChange={handleInputChange}
                  placeholder="Size (sq ft)"
                />
              </div>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <DatePickerInput
                  selectedDate={formData.date.availableFrom}
                  onChange={(date) => handleDateChange('availableFrom', date)}
                  minDate={new Date()}
                  placeholder="Available From"
                />
              </div>
              
              <div className="form-group">
                <DatePickerInput
                  selectedDate={formData.date.availableTo}
                  onChange={(date) => handleDateChange('availableTo', date)}
                  minDate={formData.date.availableFrom || new Date()}
                  placeholder="Available To"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <>
      <Header />
      <div className="upload-container">
        <h1>Create a New Listing!</h1>
        <p className="upload-subtitle">
          Fill out correct information of your listing. Make sure to double check your details!
        </p>

        <div className="steps-nav">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`step-button ${currentStep === step.id ? 'active' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              {index + 1}. {step.label}
            </button>
          ))}
        </div>

        {renderStepContent()}

        <div className="navigation-buttons">
          {currentStep !== steps[0].id && (
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <button 
            className="btn btn-primary"
            onClick={currentStep === steps[steps.length - 1].id ? () => {} : handleNext}
          >
            {currentStep === steps[steps.length - 1].id ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadListing;