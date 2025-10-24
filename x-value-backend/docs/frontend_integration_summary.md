# Frontend Integration Guide

## Tech Stack & Entry Points

- **Backend Framework**: Express.js (v5.1.0)
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **Validation**: Zod (v4.1.11)
- **Database**: File-based (JSON)
- **Entry Point**: Server runs on http://localhost:3000 by default

## API Routes Overview

### Authentication Routes

#### POST /signup
- **Description**: Register a new user
- **Authentication**: None required
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
    name: string;
  }
  ```
- **Response**: 
  ```typescript
  {
    user: {
      id: string;
      email: string;
      name: string;
      isVerified: boolean;
      createdAt: string;
    };
    token: string;
  }
  ```
- **Status Codes**:
  - 201: Successfully created
  - 409: Email already exists
  - 400: Invalid input

#### POST /login
- **Description**: Authenticate user
- **Authentication**: None required
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response**: Same as signup
- **Status Codes**:
  - 200: Success
  - 401: Invalid credentials

### Listings Routes

#### GET /listings
- **Description**: Get all listings
- **Authentication**: None required
- **Response**:
  ```typescript
  {
    listings: Array<{
      id: string;
      sellerId: string;
      title: string;
      description: string;
      price: number;
      images: string[];
      verifiedSeller: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
  }
  ```
- **Status Codes**:
  - 200: Success

#### POST /listings
- **Description**: Create a new listing
- **Authentication**: Required
- **Request Body**:
  ```typescript
  {
    title: string;
    description: string;
    price: number;
    images?: string[];
  }
  ```
- **Response**:
  ```typescript
  {
    listing: Listing;
  }
  ```
- **Status Codes**:
  - 201: Successfully created
  - 400: Invalid input
  - 401: Unauthorized

#### PATCH /listings/:id
- **Description**: Update an existing listing
- **Authentication**: Required
- **URL Parameters**: id (string)
- **Request Body**:
  ```typescript
  {
    title?: string;
    description?: string;
    price?: number;
    images?: string[];
    verifiedSeller?: boolean;
  }
  ```
- **Response**:
  ```typescript
  {
    listing: Listing;
  }
  ```
- **Status Codes**:
  - 200: Success
  - 400: Invalid input
  - 401: Unauthorized
  - 403: Permission denied (not the owner)

## Authentication Flow

1. **Token Format**: JWT
2. **Token Acquisition**: 
   - Through /signup or /login endpoints
   - Returns a token in the response
3. **Token Usage**:
   - Add to requests as Bearer token
   - Format: \`Authorization: Bearer <token>\`
4. **Token Payload**:
   ```typescript
   {
     userId: string;
     email: string;
     isVerified: boolean;
   }
   ```

## Environment Variables

Required environment variables for frontend configuration:
```bash
VITE_API_URL=http://localhost:3000  # Backend API URL
```

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
}
```

### Listing
```typescript
interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  verifiedSeller: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Special Cases

### File Uploads
- No direct file upload endpoints available
- Images are currently handled through URLs only

### WebSockets
- No WebSocket implementation currently exists

### Background Jobs
- No background jobs or cron tasks implemented

## Frontend API Client Structure

Recommended structure for frontend API client:

```typescript
// api/types.ts
export interface AuthResponse {
  user: User;
  token: string;
}

// api/client.ts
export class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth endpoints
  async signup(input: SignupInput): Promise<AuthResponse> {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Listings endpoints
  async getListings(): Promise<{ listings: Listing[] }> {
    return this.request('/listings');
  }

  async createListing(input: ListingInput): Promise<{ listing: Listing }> {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateListing(id: string, input: ListingUpdateInput): Promise<{ listing: Listing }> {
    return this.request(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }
}
```

## Testing Notes

The API has been tested for:
1. Basic authentication flow (signup/login)
2. Listing CRUD operations
3. Authorization checks

Key validation rules are implemented using Zod, ensuring type safety and input validation on both frontend and backend.