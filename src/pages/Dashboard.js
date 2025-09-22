import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vehicleAPI, bookingAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeBookings: 0,
    completedBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicles and bookings data
      const [vehiclesResponse, bookingsResponse] = await Promise.all([
        vehicleAPI.getAllVehicles(),
        bookingAPI.getAllBookings()
      ]);

      const vehicles = vehiclesResponse.vehicles || [];
      const bookings = bookingsResponse.bookings || [];

      // Calculate stats
      const totalVehicles = vehicles.length;
      const activeBookings = bookings.filter(booking => 
        ['confirmed', 'in-progress'].includes(booking.status)
      ).length;
      const completedBookings = bookings.filter(booking => 
        booking.status === 'completed'
      ).length;

      // For available vehicles, we'd need to check against current time
      // For simplicity, we'll assume all vehicles are available unless actively booked
      const currentTime = new Date();
      const busyVehicleIds = new Set(
        bookings
          .filter(booking => 
            booking.status === 'in-progress' || 
            (booking.status === 'confirmed' && new Date(booking.startTime) <= currentTime && new Date(booking.endTime) >= currentTime)
          )
          .map(booking => booking.vehicleId._id)
      );
      
      const availableVehicles = totalVehicles - busyVehicleIds.size;

      setStats({
        totalVehicles,
        availableVehicles,
        activeBookings,
        completedBookings
      });

      // Set recent bookings (last 5)
      const sortedBookings = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(sortedBookings);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'badge badge-info';
      case 'in-progress':
        return 'badge badge-warning';
      case 'completed':
        return 'badge badge-success';
      case 'cancelled':
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">FleetLink Dashboard</h1>
        <p className="page-subtitle">
          Monitor your fleet, track bookings, and manage logistics operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalVehicles}</div>
          <div className="stat-label">Total Vehicles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.availableVehicles}</div>
          <div className="stat-label">Available Now</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activeBookings}</div>
          <div className="stat-label">Active Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completedBookings}</div>
          <div className="stat-label">Completed Trips</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/add-vehicle" className="action-card">
            <div className="action-icon">🚛</div>
            <div className="action-title">Add Vehicle</div>
            <div className="action-description">
              Register a new vehicle to your fleet
            </div>
          </Link>
          <Link to="/search-book" className="action-card">
            <div className="action-icon">🔍</div>
            <div className="action-title">Search & Book</div>
            <div className="action-description">
              Find available vehicles and make bookings
            </div>
          </Link>
          <div className="action-card" onClick={fetchDashboardData} style={{ cursor: 'pointer' }}>
            <div className="action-icon">🔄</div>
            <div className="action-title">Refresh Data</div>
            <div className="action-description">
              Update dashboard with latest information
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Bookings</h2>
        </div>
        {recentBookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Start Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.vehicleId?.name || 'Unknown Vehicle'}</strong>
                      <br />
                      <small className="text-muted">
                        {booking.vehicleId?.capacityKg}kg capacity
                      </small>
                    </td>
                    <td>{booking.customerId}</td>
                    <td>
                      <span className="route-display">
                        {booking.fromPincode} → {booking.toPincode}
                      </span>
                    </td>
                    <td>{formatDate(booking.startTime)}</td>
                    <td>{booking.durationFormatted || `${booking.estimatedRideDurationHours}h`}</td>
                    <td>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No Recent Bookings</h3>
            <p>Start by creating your first booking using the Search & Book feature.</p>
            <Link to="/search-book" className="btn btn-primary">
              Make First Booking
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
