# X-Value Frontend

## Overview
Modern React application for the X-Value car listing platform, featuring an intuitive UI for browsing, listing, and managing vehicle listings.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠 Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Routing:** React Router
- **UI Components:** Custom components with shadcn/ui principles
- **HTTP Client:** Axios

## 📁 Project Structure

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for styling.

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/vite-react-car-listing.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd vite-react-car-listing
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to `http://localhost:3000` to see the application in action.

## Folder Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Base UI components (Button, Input, etc.)
│   ├── CarCard    # Car listing card component
│   ├── Filters    # Search and filter components
│   └── ...
├── pages/         # Route components
├── context/       # React Context providers
├── hooks/         # Custom React hooks
├── services/      # API integration
├── utils/         # Helper functions
└── types/         # TypeScript types/interfaces
```

## 🎯 Features

### Authentication
- User registration and login
- Protected routes
- Persistent sessions

### Car Listings
- Browse all listings
- Detailed car view
- Create new listings
- Personal listings management
- Bookmark system

### Search & Discovery
- Advanced filtering:
  - Price range
  - Year range
  - Mileage
  - Fuel type
  - Transmission
  - Location
  - Make/Model
- Sorting options:
  - Price (asc/desc)
  - Year (newest/oldest)
  - Mileage (low/high)
  - Listing date

### UI/UX
- Responsive design
- Loading states
- Error handling
- Toast notifications
- URL-synced filters and sorting

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

### API Integration
Services are configured in `src/services/api.js`:
- Base URL configuration
- Request/response interceptors
- Authentication headers

## 📱 Pages

### Public Pages
- `/` - Home/Listing Browse
- `/auth` - Login/Register
- `/cars/:id` - Car Details

### Protected Pages
- `/listings/create` - Create Listing
- `/listings/my` - My Listings
- `/bookmarks` - Saved Cars

## 🧩 Components

### Core Components
- `CarCard` - Listing display card
- `SearchFilters` - Advanced search interface
- `SortSelect` - Sorting controls
- `Header` - Navigation and auth state
- `Footer` - Site footer

### Form Components
- `Input` - Text input
- `Select` - Dropdown select
- `Button` - Action button
- Custom form controls

## 🔗 State Management

### Auth Context
- User authentication state
- Login/logout functions
- Token management

### API Integration
- Axios instance configuration
- API endpoints
- Error handling

## 🎨 Styling

### Tailwind Configuration
- Custom colors
- Extended theme
- Responsive breakpoints
- Custom utilities

### Component Styling
- Consistent design system
- Responsive patterns
- Dark mode support

## 🚀 Deployment

```bash
# Build production assets
npm run build

# Preview build
npm run preview
```

## 📚 Development Guide

### Code Style
- Follow ESLint configuration
- Use TypeScript types
- Maintain component structure
- Follow naming conventions

### Adding New Features
1. Create components in appropriate directories
2. Add routes if needed
3. Implement API integration
4. Add to navigation if required
5. Update types as necessary

### Performance Considerations
- Lazy loading for routes
- Optimized images
- Efficient re-renders
- Memoization where needed

## 🤝 Contributing
1. Branch naming: `feature/`, `fix/`, `refactor/`
2. Follow commit message conventions
3. Submit PRs with descriptions
4. Keep changes focused and atomic

## 📝 License
MIT License - see LICENSE file for details