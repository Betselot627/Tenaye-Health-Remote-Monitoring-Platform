# Backend Features - Tenaye Health Remote Monitoring Platform

## Overview
The backend is built with Node.js/Express and MongoDB, providing a comprehensive healthcare platform API with real-time communication via Socket.IO.

---

## Core Features Implemented

### 1. **Authentication & Authorization**
- **User Registration**: Email-based registration with password hashing (bcrypt)
- **User Login**: JWT token-based authentication
- **Token Validation**: Protected routes using Bearer token verification
- **Role-Based Access Control**: Support for patient, doctor, and admin roles
- **Current User Retrieval**: Fetch authenticated user profile

**Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me (protected)
```

---

### 2. **Doctor Management**
- **List All Doctors**: Browse verified doctors with filtering by specialty
- **Get Doctor Details**: View specific doctor profile with rating and experience
- **Doctor Profiles**: Include specialty, bio, rating, years of experience, consultation fee, and availability

**Endpoints:**
```
GET    /api/doctors (protected) - List all doctors, filterable by specialty
GET    /api/doctors/:id (protected) - Get doctor by ID
```

**Doctor Schema:**
- User reference (linked to User model)
- Specialty (medical field)
- Bio and years of experience
- Rating (numeric)
- Verification status
- Consultation fee
- Availability slots (day/time based)

---

### 3. **Appointment Management**
- **Create Appointments**: Schedule appointments with doctors
- **View Appointments**: Get all appointments for logged-in user (patients/doctors)
- **Update Status**: Change appointment status (upcoming → completed/cancelled)
- **Video Room Assignment**: Link video consultation room to appointments

**Endpoints:**
```
POST   /api/appointments (protected) - Create appointment
GET    /api/appointments/mine (protected) - Get user's appointments
PATCH  /api/appointments/:id (protected) - Update appointment status
```

**Appointment Schema:**
- Patient and Doctor references
- Scheduled date/time
- Status tracking (upcoming, completed, cancelled)
- Video room ID for consultations
- Notes field

---

### 4. **Health Tracker System**
- **Manual Health Tracking**: Log vital signs manually
- **Camera-Based Tracking**: RPPG (Remote Photoplethysmography) for heart rate via camera
- **SpO2 Measurement**: Blood oxygen saturation measurement via camera
- **Multiple Tracker Types**: Blood sugar, blood pressure, heart rate, weight, etc.
- **Confidence Levels**: Track measurement reliability (high/medium/low)
- **Filter by Type**: Query trackers by tracker type

**Endpoints:**
```
POST   /api/trackers (protected) - Add tracker entry
GET    /api/trackers (protected) - Get user's trackers (filterable by type)
DELETE /api/trackers/:id (protected) - Delete tracker entry
```

**Tracker Schema:**
- Patient reference
- Tracker type (blood_sugar, blood_pressure, heart_rate, weight)
- Numeric value and unit
- Source (manual, rppg_camera, spo2_camera)
- Confidence level
- Optional consultation reference
- Recorded timestamp

---

### 5. **Blog Management**
- **Create Blog Posts**: Doctors/users publish health articles
- **List Blogs**: Browse all published blogs sorted by date
- **View Blog Details**: Read specific blog with author information
- **Like/Unlike System**: Toggle likes on blog posts with like counter

**Endpoints:**
```
GET    /api/blogs (protected) - Get all blogs
GET    /api/blogs/:id (protected) - Get specific blog
POST   /api/blogs (protected) - Create new blog
PATCH  /api/blogs/:id/like (protected) - Toggle like on blog
```

**Blog Schema:**
- Author reference
- Title and content
- Cover image URL
- Likes array (tracks users who liked)
- Published date

---

### 6. **Payment Processing**
- **Payment Initiation**: Start payment for doctor consultations
- **Multi-Gateway Support**: Chapa and Telebirr payment gateways
- **Payment Tracking**: Track payment status (pending, paid, failed)
- **Transaction Reference**: Generate unique transaction IDs
- **Payment History**: View all payments by patient

**Endpoints:**
```
GET    /api/payments (protected) - Get user's payment history
POST   /api/payments/init (protected) - Initiate payment
```

**Payment Schema:**
- Patient and Doctor references
- Appointment reference
- Amount and currency (default: ETB)
- Payment gateway (Chapa/Telebirr)
- Status tracking
- Transaction reference
- Paid timestamp

---

### 7. **Video Consultation & WebRTC Signaling**
- **Create Video Room**: Generate unique room IDs for consultations
- **End Call**: Update appointment status to completed when call ends
- **Real-time Signaling**: Socket.IO for WebRTC negotiation
  - Offer/Answer exchange
  - ICE candidate transmission
  - Call termination
  - User join/leave notifications

**Endpoints:**
```
POST   /api/call/create-room (protected) - Create video room
POST   /api/call/end-room (protected) - End video call
```

**Socket.IO Events:**
```
join-room          - Join video call room
offer              - Send WebRTC offer
answer             - Send WebRTC answer
ice-candidate      - Send ICE candidate
end-call           - Terminate call
user-joined        - Notify user joined
call-ended         - Notify call ended
```

---

### 8. **Data Models**

#### User
```
- full_name (string)
- email (string, unique)
- password (string, hashed)
- role (patient, doctor, admin)
- gender (string)
- age (number)
- phone (string)
- avatar_url (string)
- timestamps
```

#### Doctor
```
- user (ref: User)
- specialty (string)
- bio (string)
- rating (number)
- years_experience (number)
- is_verified (boolean)
- consultation_fee (number)
- availability (array of day/slots)
- timestamps
```

#### Appointment
```
- patient (ref: User)
- doctor (ref: Doctor)
- scheduled_at (date)
- status (upcoming, completed, cancelled)
- video_room_id (string)
- notes (string)
- timestamps
```

#### Tracker
```
- patient (ref: User)
- tracker_type (string)
- value (number)
- unit (string)
- note (string)
- source (manual, rppg_camera, spo2_camera)
- confidence (high, medium, low)
- consultation (ref: Appointment)
- recorded_at (date)
- timestamps
```

#### Blog
```
- author (ref: User)
- title (string)
- content (string)
- cover_image_url (string)
- likes (array of User refs)
- published_at (date)
- timestamps
```

#### Payment
```
- patient (ref: User)
- doctor (ref: Doctor)
- appointment (ref: Appointment)
- amount (number)
- currency (string, default: ETB)
- gateway (chapa, telebirr)
- status (pending, paid, failed)
- tx_ref (string)
- paid_at (date)
- timestamps
```

#### Prescription
```
- patient (ref: User)
- doctor (ref: Doctor)
- medication (string)
- dosage (string)
- duration (string)
- notes (string)
- timestamps
```

#### LabOrder
```
- patient (ref: User)
- doctor (ref: Doctor)
- test_name (string)
- status (pending, completed)
- result (string)
- ordered_at (date)
- timestamps
```

#### Notification
```
- Status: Model exists but route not fully implemented (placeholder)
```

#### Message
```
- Status: Model exists but not yet implemented in controllers/routes
```

---

### 9. **Middleware**

#### Authentication Middleware (`protect`)
- Validates JWT tokens from Authorization header
- Extracts user information and attaches to request
- Returns 401 for missing or invalid tokens

#### Role-Based Authorization Middleware (`requireRole`)
- Checks if authenticated user has required role
- Returns 403 for unauthorized roles
- Reusable for specific endpoints

---

### 10. **Additional Features**

#### Health Check Endpoint
```
GET /health - Returns server and database status
```

#### CORS Configuration
- Configured for frontend on localhost:5173 (or via env variable)
- Supports GET and POST methods

#### Error Handling
- Try-catch blocks on all controller functions
- Consistent error response format
- Status codes (201, 400, 401, 403, 404, 500)

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Hashing | bcryptjs |
| Real-time | Socket.IO |
| Environment | dotenv |
| Cors | cors package |

---

## Database Connection
- MongoDB connection managed via `config/db.js`
- Connection established on server startup
- Mongoose models automatically synced with database

---

## Notable Features

✅ **Implemented:**
- User authentication and authorization
- Doctor profiles and discovery
- Appointment booking and management
- Health tracking (manual + AI-based camera tracking)
- Blog publishing and social engagement
- Payment processing with multiple gateways
- Real-time video consultation via WebRTC
- Role-based access control
- Health tracker data with confidence levels

⏳ **In Progress/Placeholder:**
- Notifications (model exists, route minimal)
- Direct messaging (model exists, not implemented)
- Prescription management (model exists, not fully implemented)
- Lab order management (model exists, not fully implemented)

---

## API Base URL
```
http://localhost:3001/api
```

## Environment Variables Required
```
PORT
DATABASE_URL (MongoDB connection string)
JWT_SECRET
CORS_ORIGIN
```


Reviewed 8 files
Project Routes Summary
Frontend Routes
Public Routes:

/ → redirects to /home
/home - Home page
/login - Login
/register - Register
/forgot-password - Forgot password
/reset-password - Reset password
* → redirects to /home (catch-all)
Admin Routes (protected):

/admin - Dashboard
/admin/search - Search results
/admin/users - Users management
/admin/doctors - Doctors management
/admin/appointments - Appointments
/admin/medical-records - Medical records
/admin/blogs - Blogs
/admin/payments - Payments
/admin/notifications - Notifications
/admin/settings - Settings
Doctor Routes (protected):

/doctor - Dashboard
/doctor/appointments - Appointments
/doctor/patients - Patients
/doctor/prescriptions - Prescriptions
/doctor/lab-orders - Lab orders
/doctor/vitals - Vitals
/doctor/blogs - Blogs
/doctor/earnings - Earnings
/doctor/schedule - Schedule
/doctor/settings - Settings
Patient Routes (protected):

/patient - Dashboard
/patient/appointments - Appointments
/patient/doctors - Find doctors
/patient/prescriptions - Prescriptions
/patient/lab-results - Lab results
/patient/vitals - Vitals
/patient/billing - Billing
/patient/blogs - Blogs
/patient/settings - Settings
Backend API Routes
Auth Routes (/api/auth)

POST /register - User registration
POST /login - User login
GET /me - Get current user (protected)
Appointment Routes (/api/appointments)

POST / - Create appointment (protected)
GET /mine - Get my appointments (protected)
PATCH /:id - Update appointment status (protected)
Doctor Routes (/api/doctors)

GET / - Get all doctors (protected)
GET /:id - Get doctor by ID (protected)
Blog Routes (/api/blogs)

GET / - Get all blogs (protected)
GET /:id - Get blog by ID (protected)
POST / - Create blog (protected)
PATCH /:id/like - Toggle like (protected)
Payment Routes (/api/payments)

GET / - Get payments (protected)
POST /init - Initiate payment (protected)
Tracker Routes (/api/tracker)

POST / - Add tracker (protected)
GET / - Get trackers (protected)
DELETE /:id - Delete tracker (protected)
Call Routes (/api/calls)

POST /create-room - Create video room (protected)
POST /end-room - End video call (protected)
Notification Routes (/api/notifications)

POST /send - Send notification (placeholder)