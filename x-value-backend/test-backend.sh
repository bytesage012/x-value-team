#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

echo "1. Testing Health Check..."
curl -s -X GET $BASE_URL/health | json_pp

echo -e "\n2. Testing Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')
echo $SIGNUP_RESPONSE | json_pp

# Extract token from signup response
TOKEN=$(echo $SIGNUP_RESPONSE | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

echo -e "\n3. Testing Login..."
curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | json_pp

echo -e "\n4. Testing Get Listings..."
curl -s -X GET $BASE_URL/listings | json_pp

echo -e "\n5. Testing Create Listing..."
LISTING_RESPONSE=$(curl -s -X POST $BASE_URL/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Listing",
    "description": "This is a test listing",
    "price": 999.99,
    "images": ["https://example.com/image1.jpg"]
  }')
echo $LISTING_RESPONSE | json_pp

# Extract listing ID from create response
LISTING_ID=$(echo $LISTING_RESPONSE | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

echo -e "\n6. Testing Update Listing..."
curl -s -X PATCH $BASE_URL/listings/$LISTING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Test Listing",
    "price": 1099.99
  }' | json_pp
