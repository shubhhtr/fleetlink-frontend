import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vehicleAPI, bookingAPI } from '../services/api';

const SearchAndBook = () => {
  const [searchForm, setSearchForm] = useState({
    capacityRequired: '',
    fromPincode: '',
    toPincode: '',
    startTime: new Date(Date.now() + 60 * 60 * 1000) // Default to 1 hour from now
  });
  
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'capacityRequired') {
      const numericValue = value === '' ? '' : Number(value);
      setSearchForm(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setSearchForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    setSearchForm(prev => ({
      ...prev,
      startTime: date
    }));
    
    // Clear date error if exists
    if (errors.startTime) {
      setErrors(prev => ({
        ...prev,
        startTime: ''
      }));
    }
  };

  const validateSearchForm = () => {
    const newErrors = {};

    // Capacity validation
    if (!searchForm.capacityRequired) {
      newErrors.capacityRequired = 'Capacity requirement is required';
    } else if (searchForm.capacityRequired <= 0) {
      newErrors.capacityRequired = 'Capacity must be greater than 0';
    }

    // Pincode validation
    if (!searchForm.fromPincode) {
      newErrors.fromPincode = 'From pincode is required';
    } else if (!/^\d{6}$/.test(searchForm.fromPincode)) {
      newErrors.fromPincode = 'Pincode must be exactly 6 digits';
    }

    if (!searchForm.toPincode) {
      newErrors.toPincode = 'To pincode is required';
    } else if (!/^\d{6}$/.test(searchForm.toPincode)) {
      newErrors.toPincode = 'Pincode must be exactly 6 digits';
    }

    // Date validation
    if (!searchForm.startTime) {
      newErrors.startTime = 'Start time is required';
    } else if (searchForm.startTime <= new Date()) {
      newErrors.startTime = 'Start time must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!validateSearchForm()) {
      toast.error('Please fix the form errors before searching');
      return;
    }

    setLoading(true);
    setSearchResults(null);

    try {
      const searchParams = {
        capacityRequired: searchForm.capacityRequired,
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startTime.toISOString()
      };

      const response = await vehicleAPI.findAvailableVehicles(searchParams);
      setSearchResults(response);
      
      if (response.availableVehicles.length === 0) {
        toast.info('No vehicles available for the specified criteria');
      } else {
        toast.success(`Found ${response.availableVehicles.length} available vehicle(s)`);
      }

    } catch (error) {
      console.error('Error searching vehicles:', error);
      toast.error(error.message || 'Failed to search vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleBookVehicle = async (vehicle) => {
    // Simple customer ID for demo - in real app, this would come from authentication
    const customerId = prompt('Enter Customer ID:', 'CUSTOMER-' + Date.now().toString().slice(-6));
    
    if (!customerId || !customerId.trim()) {
      toast.error('Customer ID is required for booking');
      return;
    }

    setBookingLoading(vehicle._id);

    try {
      const bookingData = {
        vehicleId: vehicle._id,
        customerId: customerId.trim(),
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startTime.toISOString()
      };

      const response = await bookingAPI.createBooking(bookingData);
      
      toast.success('Vehicle booked successfully!');
      console.log('Booking created:', response.booking);
      
      // Remove the booked vehicle from search results
      setSearchResults(prev => ({
        ...prev,
        availableVehicles: prev.availableVehicles.filter(v => v._id !== vehicle._id)
      }));

    } catch (error) {
      console.error('Error booking vehicle:', error);
      toast.error(error.message || 'Failed to book vehicle');
    } finally {
      setBookingLoading(null);
    }
  };

  const formatDuration = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  const resetSearch = () => {
    setSearchForm({
      capacityRequired: '',
      fromPincode: '',
      toPincode: '',
      startTime: new Date(Date.now() + 60 * 60 * 1000)
    });
    setSearchResults(null);
    setErrors({});
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Search & Book Vehicles</h1>
        <p className="page-subtitle">
          Find available vehicles based on your requirements and book instantly
        </p>
      </div>

      {/* Search Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Search Criteria</h2>
        </div>

        <form onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacityRequired" className="form-label">
                Required Capacity (KG) *
              </label>
              <input
                type="number"
                id="capacityRequired"
                name="capacityRequired"
                value={searchForm.capacityRequired}
                onChange={handleInputChange}
                className={`form-control ${errors.capacityRequired ? 'error' : ''}`}
                placeholder="e.g., 500"
                min="1"
                disabled={loading}
              />
              {errors.capacityRequired && (
                <div className="error-message">{errors.capacityRequired}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="startTime" className="form-label">
                Start Date & Time *
              </label>
              <DatePicker
                selected={searchForm.startTime}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                timeFormat="HH:mm"
                timeIntervals={15}
                minDate={new Date()}
                className={`form-control ${errors.startTime ? 'error' : ''}`}
                placeholderText="Select start date and time"
                disabled={loading}
              />
              {errors.startTime && (
                <div className="error-message">{errors.startTime}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fromPincode" className="form-label">
                From Pincode *
              </label>
              <input
                type="text"
                id="fromPincode"
                name="fromPincode"
                value={searchForm.fromPincode}
                onChange={handleInputChange}
                className={`form-control ${errors.fromPincode ? 'error' : ''}`}
                placeholder="e.g., 110001"
                maxLength="6"
                disabled={loading}
              />
              {errors.fromPincode && (
                <div className="error-message">{errors.fromPincode}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="toPincode" className="form-label">
                To Pincode *
              </label>
              <input
                type="text"
                id="toPincode"
                name="toPincode"
                value={searchForm.toPincode}
                onChange={handleInputChange}
                className={`form-control ${errors.toPincode ? 'error' : ''}`}
                placeholder="e.g., 110002"
                maxLength="6"
                disabled={loading}
              />
              {errors.toPincode && (
                <div className="error-message">{errors.toPincode}</div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={resetSearch}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                  Searching...
                </>
              ) : (
                'Search Vehicles'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="search-results slide-up">
          <div className="search-summary">
            <h3>Search Results</h3>
            <p>
              Found <strong>{searchResults.availableVehicles.length}</strong> available vehicle(s) 
              for your requirements
            </p>
            
            <div className="search-criteria">
              <div className="criteria-item">
                <div className="criteria-label">Capacity Required</div>
                <div className="criteria-value">{searchResults.searchCriteria.capacityRequired} kg</div>
              </div>
              <div className="criteria-item">
                <div className="criteria-label">Route</div>
                <div className="criteria-value">
                  {searchResults.searchCriteria.fromPincode} → {searchResults.searchCriteria.toPincode}
                </div>
              </div>
              <div className="criteria-item">
                <div className="criteria-label">Start Time</div>
                <div className="criteria-value">
                  {new Date(searchResults.searchCriteria.startTime).toLocaleString()}
                </div>
              </div>
              <div className="criteria-item">
                <div className="criteria-label">Estimated Duration</div>
                <div className="criteria-value">
                  {formatDuration(searchResults.searchCriteria.estimatedRideDurationHours)}
                </div>
              </div>
            </div>
          </div>

          {searchResults.availableVehicles.length > 0 ? (
            <div className="vehicle-grid">
              {searchResults.availableVehicles.map((vehicle) => (
                <div key={vehicle._id} className="vehicle-card available">
                  <div className="vehicle-header">
                    <h3 className="vehicle-name">{vehicle.name}</h3>
                    <span className="vehicle-status available">Available</span>
                  </div>
                  
                  <div className="vehicle-details">
                    <div className="vehicle-detail">
                      <span className="detail-label">Capacity</span>
                      <span className="detail-value">{vehicle.capacityKg} kg</span>
                    </div>
                    <div className="vehicle-detail">
                      <span className="detail-label">Tyres</span>
                      <span className="detail-value">{vehicle.tyres}</span>
                    </div>
                    <div className="vehicle-detail">
                      <span className="detail-label">Estimated Duration</span>
                      <span className="detail-value">
                        {formatDuration(vehicle.estimatedRideDurationHours)}
                      </span>
                    </div>
                    <div className="vehicle-detail">
                      <span className="detail-label">Route</span>
                      <span className="detail-value">
                        {vehicle.availableForRoute.from} → {vehicle.availableForRoute.to}
                      </span>
                    </div>
                  </div>
                  
                  <div className="vehicle-actions">
                    <button
                      onClick={() => handleBookVehicle(vehicle)}
                      className="btn btn-success"
                      disabled={bookingLoading === vehicle._id}
                    >
                      {bookingLoading === vehicle._id ? (
                        <>
                          <span className="spinner" style={{ width: '14px', height: '14px', marginRight: '6px' }}></span>
                          Booking...
                        </>
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🚛</div>
              <h3>No Vehicles Available</h3>
              <p>
                No vehicles match your search criteria. Try adjusting your requirements 
                or selecting a different time slot.
              </p>
              <button onClick={resetSearch} className="btn btn-primary">
                Search Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndBook;
