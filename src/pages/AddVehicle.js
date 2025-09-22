import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { vehicleAPI } from '../services/api';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    name: '',
    capacityKg: '',
    tyres: ''
  });
  const [loading, setLoading] = useState(false);
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

    // Handle numeric fields
    if (name === 'capacityKg' || name === 'tyres') {
      const numericValue = value === '' ? '' : Number(value);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Vehicle name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Vehicle name cannot exceed 100 characters';
    }

    // Capacity validation
    if (!formData.capacityKg) {
      newErrors.capacityKg = 'Capacity is required';
    } else if (formData.capacityKg <= 0) {
      newErrors.capacityKg = 'Capacity must be greater than 0';
    } else if (formData.capacityKg > 50000) {
      newErrors.capacityKg = 'Capacity cannot exceed 50,000 kg';
    }

    // Tyres validation
    if (!formData.tyres) {
      newErrors.tyres = 'Number of tyres is required';
    } else if (formData.tyres < 2) {
      newErrors.tyres = 'Vehicle must have at least 2 tyres';
    } else if (formData.tyres > 18) {
      newErrors.tyres = 'Vehicle cannot have more than 18 tyres';
    } else if (formData.tyres % 1 !== 0) {
      newErrors.tyres = 'Number of tyres must be a whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const vehicleData = {
        name: formData.name.trim(),
        capacityKg: Number(formData.capacityKg),
        tyres: Number(formData.tyres)
      };

      const response = await vehicleAPI.addVehicle(vehicleData);
      
      toast.success('Vehicle added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        capacityKg: '',
        tyres: ''
      });
      setErrors({});

      console.log('Vehicle added:', response.vehicle);

    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error(error.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      capacityKg: '',
      tyres: ''
    });
    setErrors({});
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Add New Vehicle</h1>
        <p className="page-subtitle">
          Register a new vehicle to expand your fleet capacity
        </p>
      </div>

      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Vehicle Information</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Vehicle Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="e.g., Tata Ace, Mahindra Bolero, etc."
                disabled={loading}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="capacityKg" className="form-label">
                  Capacity (KG) *
                </label>
                <input
                  type="number"
                  id="capacityKg"
                  name="capacityKg"
                  value={formData.capacityKg}
                  onChange={handleInputChange}
                  className={`form-control ${errors.capacityKg ? 'error' : ''}`}
                  placeholder="e.g., 1000"
                  min="1"
                  max="50000"
                  disabled={loading}
                />
                {errors.capacityKg && (
                  <div className="error-message">{errors.capacityKg}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tyres" className="form-label">
                  Number of Tyres *
                </label>
                <input
                  type="number"
                  id="tyres"
                  name="tyres"
                  value={formData.tyres}
                  onChange={handleInputChange}
                  className={`form-control ${errors.tyres ? 'error' : ''}`}
                  placeholder="e.g., 4"
                  min="2"
                  max="18"
                  disabled={loading}
                />
                {errors.tyres && (
                  <div className="error-message">{errors.tyres}</div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                disabled={loading}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                    Adding Vehicle...
                  </>
                ) : (
                  'Add Vehicle'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Guidelines</h3>
          </div>
          <div style={{ padding: '0 24px 24px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Vehicle Name:</strong> Use descriptive names that help identify the vehicle (e.g., "Tata Ace - Red", "Mahindra Pickup - MH01AB1234")
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Capacity:</strong> Enter the maximum load capacity in kilograms (1 to 50,000 kg)
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Tyres:</strong> Specify the total number of tyres (2 to 18 tyres)
              </li>
              <li>
                All fields marked with (*) are required for successful registration
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
