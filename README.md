# FleetLink Frontend

The user-facing side of FleetLink - a clean, responsive web application that makes vehicle booking simple and intuitive. Built with React and designed with logistics professionals in mind.

## Overview

This frontend provides a complete interface for managing your fleet operations. From adding new vehicles to your fleet to searching and booking available vehicles for specific routes, everything is designed to be fast and user-friendly.

The interface was built with real logistics workflows in mind - we've focused on reducing clicks, providing clear feedback, and making sure the most common tasks are just a few taps away.

## What's Inside

- **Dashboard** - Overview of your fleet with quick stats and recent activity
- **Add Vehicle** - Simple form to register new vehicles with driver details
- **Search & Book** - Smart search interface to find and book available vehicles
- **Responsive Design** - Works great on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - Latest React with hooks and modern patterns
- **React Router** - Client-side routing for smooth navigation
- **Axios** - HTTP client for API communication
- **React DatePicker** - User-friendly date/time selection
- **React Toastify** - Clean notification system
- **CSS3** - Custom styling with modern CSS features

## Getting Started

### Prerequisites

You'll need:
- Node.js (v16 or higher)
- npm or yarn
- The FleetLink backend running (see backend README)

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   
   Navigate to `http://localhost:3000` and you should see the FleetLink dashboard.

The app will automatically reload when you make changes to the code.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Launches the test runner |
| `npm run eject` | Ejects from Create React App (irreversible) |

## Project Structure

```
frontend/
├── public/              # Static assets
│   ├── index.html       # Main HTML template
│   └── favicon.ico      # Site icon
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Header.js    # Navigation header
│   ├── pages/           # Main application pages
│   │   ├── Dashboard.js      # Fleet overview and stats
│   │   ├── AddVehicle.js     # Vehicle registration form
│   │   └── SearchAndBook.js  # Vehicle search and booking
│   ├── services/        # API communication
│   │   └── api.js       # Axios configuration and API calls
│   ├── App.js           # Main app component with routing
│   ├── App.css          # Global application styles
│   ├── index.js         # React app entry point
│   └── index.css        # Base CSS styles
├── Dockerfile           # Container configuration
├── nginx.conf           # Production web server config
└── package.json         # Dependencies and scripts
```

## Key Features

### Dashboard
- **Fleet Overview**: Quick stats on total vehicles, active bookings, and available vehicles
- **Recent Activity**: Latest bookings and vehicle additions
- **Quick Actions**: Fast access to common tasks

### Vehicle Management
- **Easy Registration**: Add vehicles with comprehensive details including driver information
- **Validation**: Real-time form validation to prevent errors
- **Driver Details**: Capture driver name, phone, and license information

### Smart Booking System
- **Route-Based Search**: Find vehicles available for specific pickup and drop-off locations
- **Time-Aware Filtering**: Only shows vehicles available at your requested time
- **Instant Booking**: One-click booking with immediate confirmation
- **Real-Time Updates**: Live availability updates as you search

### User Experience
- **Responsive Design**: Optimized for all screen sizes
- **Loading States**: Clear feedback during API calls
- **Error Handling**: Friendly error messages with actionable advice
- **Toast Notifications**: Non-intrusive success and error notifications

## API Integration

The frontend communicates with the backend through a centralized API service (`src/services/api.js`). This handles:

- **Authentication**: Ready for future auth implementation
- **Error Handling**: Consistent error processing across all API calls
- **Request Interceptors**: Automatic request formatting
- **Response Processing**: Standardized response handling

### API Endpoints Used

- `GET /api/vehicles` - Fetch all vehicles for dashboard
- `POST /api/vehicles` - Add new vehicles
- `GET /api/vehicles/available` - Search available vehicles
- `POST /api/bookings` - Create new bookings
- `GET /api/bookings` - Fetch booking history

## Styling & Design

The app uses a modern, clean design with:

- **Color Scheme**: Professional blues and grays with accent colors
- **Typography**: Clear, readable fonts optimized for logistics data
- **Layout**: Card-based design with consistent spacing
- **Interactive Elements**: Hover effects and smooth transitions
- **Mobile-First**: Responsive design that works on all devices

### Customizing Styles

Main styles are in:
- `src/App.css` - Component-specific styles
- `src/index.css` - Global styles and CSS variables

To customize the color scheme, update the CSS variables in `index.css`:

```css
:root {
  --primary-color: #2c5aa0;
  --secondary-color: #34495e;
  --accent-color: #3498db;
  /* ... other variables */
}
```

## Building for Production

To create a production build:

```bash
npm run build
```

This creates a `build` folder with optimized files ready for deployment. The build is minified and includes hashes for caching.

### Docker Deployment

The frontend includes Docker configuration for production deployment:

```bash
# Build the production image
docker build -t fleetlink-frontend .

# Run the container
docker run -p 80:80 fleetlink-frontend
```

The Docker image uses Nginx to serve the built React app with optimized configuration for production.

## Environment Configuration

The app uses Create React App's environment variable system. For different environments:

### Development
The app automatically proxies API requests to `http://localhost:5000` (configured in `package.json`).

### Production
Update the API base URL in `src/services/api.js` to point to your production backend:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

Set `REACT_APP_API_URL` environment variable during build:

```bash
REACT_APP_API_URL=https://your-backend-domain.com npm run build
```

## Common Issues & Solutions

**API Connection Issues**
- Make sure the backend is running on port 5000
- Check that CORS is properly configured in the backend
- Verify the API base URL in `src/services/api.js`

**Build Failures**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Make sure you're using a compatible Node.js version (v16+)

**Styling Issues**
- Check browser developer tools for CSS conflicts
- Ensure CSS imports are in the correct order
- Clear browser cache if styles aren't updating

## Browser Support

FleetLink frontend supports:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

For older browser support, you may need to add polyfills.

## Testing

The app includes testing setup with React Testing Library:

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

Tests are located alongside components and follow the `*.test.js` naming convention.

## Contributing

When adding new features:

1. **Components**: Keep components small and focused on a single responsibility
2. **Styling**: Use the existing CSS variables for consistency
3. **API Calls**: Add new API functions to `src/services/api.js`
4. **Routing**: Update `App.js` for new pages
5. **Testing**: Add tests for new components and functionality

## Performance Tips

For optimal performance:
- **Code Splitting**: Consider lazy loading for large components
- **Image Optimization**: Compress images and use appropriate formats
- **Bundle Analysis**: Use `npm run build` and analyze the bundle size
- **Caching**: The production build includes proper caching headers

## Future Enhancements

Some ideas for future development:
- **Real-time Updates**: WebSocket integration for live booking updates
- **Advanced Filtering**: More sophisticated vehicle search options
- **Booking History**: Detailed booking management and history
- **User Authentication**: Login system with role-based access
- **Mobile App**: React Native version for mobile devices

## License

MIT License - feel free to use this in your own projects!
