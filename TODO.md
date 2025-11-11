# MongoDB Setup for Next.js Velocity App

## Plan Overview
Replace localStorage with MongoDB for persistent data storage in the Velocity app.

## Steps to Complete

### 1. Create MongoDB Connection Utility
- [x] Create `lib/mongodb.ts` for database connection handling

### 2. Create Mongoose Models
- [x] Create `lib/models/trip.ts` for Trip schema
- [x] Create `lib/models/userProfile.ts` for UserProfile schema
- [x] Create `lib/models/message.ts` for Message schema
- [x] Create `lib/models/notification.ts` for NotificationItem schema
- [x] Create `lib/models/splitTransaction.ts` for SplitTransaction schema
- [x] Create `lib/models/appSettings.ts` for AppSettings schema

### 3. Set Up Environment Variables
- [x] Update `.env` with MONGODB_URI

### 4. Create API Routes
- [x] Create `app/api/trips/route.ts` for trips CRUD operations
- [x] Create `app/api/messages/route.ts` for messages CRUD operations
- [x] Create `app/api/notifications/route.ts` for notifications CRUD operations
- [x] Create `app/api/profile/route.ts` for profile CRUD operations
- [x] Create `app/api/settings/route.ts` for settings CRUD operations
- [x] Create `app/api/splits/route.ts` for splits CRUD operations

### 5. Update Storage Functions
- [x] Update `lib/storage.ts` to use API calls instead of localStorage

### 6. Initialize Connection
- [x] Ensure MongoDB connection is initialized in API routes

## Followup Steps
- [x] Test MongoDB connection and data persistence
- [ ] Handle connection errors and implement error responses
- [ ] Consider data migration from localStorage if needed
