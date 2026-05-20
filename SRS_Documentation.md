# Software Requirements Specification (SRS)
# Tenaye Health Remote Monitoring Platform

**Version:** 1.0  
**Date:** May 19, 2026  
**Prepared For:** Academic Advisor  
**Project Type:** Web-based Healthcare Platform  

---

## 1. Introduction

### 1.1 Purpose
The Tenaye Health Remote Monitoring Platform is a comprehensive web-based healthcare system designed to facilitate remote medical consultations, health monitoring, and healthcare management. The platform connects patients with healthcare providers through video consultations, enables health tracking, manages appointments, prescriptions, and payments, and provides educational content through a blog system.

### 1.2 Scope
The platform serves three primary user roles:
- **Patients**: Access healthcare services, book appointments, monitor health metrics, view prescriptions, and make payments
- **Doctors**: Conduct video consultations, manage schedules, prescribe medications, view patient health data, and track earnings
- **Administrators**: Manage users, verify doctors, oversee payments, and manage content

### 1.3 Intended Audience
- Patients seeking remote healthcare services
- Licensed medical professionals providing telemedicine services
- System administrators managing platform operations
- Academic advisors reviewing the project architecture and implementation

---

## 2. System Overview

### 2.1 Architecture
The platform follows a client-server architecture with:
- **Frontend**: React-based single-page application (SPA)
- **Backend**: RESTful API with real-time WebSocket communication
- **Database**: MongoDB for data persistence
- **Real-time Communication**: Socket.IO for video call signaling and notifications

### 2.2 Technology Stack

#### Frontend
- **Framework**: React 19.2.5 with Vite 8.0.9
- **Styling**: TailwindCSS 4.2.4
- **Routing**: React Router DOM 7.14.2
- **Real-time**: Socket.IO Client 4.7.5
- **Video**: WebRTC for peer-to-peer video consultations
- **Video SDK**: Stream.io Video React SDK 1.12.4 (optional integration)

#### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB with Mongoose 8.4.1 ODM
- **Authentication**: JWT (jsonwebtoken 9.0.2) with bcryptjs 2.4.3 for password hashing
- **Real-time**: Socket.IO 4.7.5
- **File Upload**: Multer 1.4.5
- **PDF Generation**: PDFKit 0.15.0
- **Payment Integration**: Chapa and Telebirr gateways

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

#### 3.1.1 User Registration
- **FR-1.1**: System shall allow users to register with email, password, full name, gender, age, and phone number
- **FR-1.2**: System shall hash passwords using bcrypt before storage
- **FR-1.3**: System shall support three user roles: patient, doctor, and admin
- **FR-1.4**: System shall validate email uniqueness during registration

#### 3.1.2 User Login
- **FR-1.5**: System shall authenticate users via email and password
- **FR-1.6**: System shall generate JWT tokens upon successful authentication
- **FR-1.7**: System shall store JWT tokens in client-side localStorage
- **FR-1.8**: System shall provide token validation middleware for protected routes

#### 3.1.3 Role-Based Access Control (RBAC)
- **FR-1.9**: System shall restrict patient routes to authenticated patients only
- **FR-1.10**: System shall restrict doctor routes to authenticated doctors only
- **FR-1.11**: System shall restrict admin routes to authenticated administrators only
- **FR-1.12**: System shall return 403 Forbidden for unauthorized role access attempts

### 3.2 Doctor Management

#### 3.2.1 Doctor Profiles
- **FR-2.1**: System shall allow doctors to create profiles with specialty, bio, years of experience, and consultation fee
- **FR-2.2**: System shall display doctor ratings and verification status
- **FR-2.3**: System shall allow patients to browse and filter doctors by specialty
- **FR-2.4**: System shall require admin approval for new doctor registrations

#### 3.2.2 Schedule Management
- **FR-2.5**: System shall allow doctors to set weekly availability schedules
- **FR-2.6**: System shall display available time slots to patients
- **FR-2.7**: System shall prevent double-booking of time slots

### 3.3 Appointment Management

#### 3.3.1 Appointment Booking
- **FR-3.1**: System shall allow patients to book appointments with available doctors
- **FR-3.2**: System shall require payment before appointment confirmation
- **FR-3.3**: System shall generate unique video room IDs for each appointment
- **FR-3.4**: System shall send appointment confirmation notifications

#### 3.3.2 Appointment Viewing
- **FR-3.5**: System shall display patient's upcoming and past appointments
- **FR-3.6**: System shall display doctor's scheduled appointments
- **FR-3.7**: System shall track appointment status (upcoming, completed, cancelled)
- **FR-3.8**: System shall allow patients to cancel appointments

### 3.4 Video Consultation System

#### 3.4.1 Video Call Features
- **FR-4.1**: System shall establish peer-to-peer WebRTC video connections
- **FR-4.2**: System shall provide real-time audio/video streaming
- **FR-4.3**: System shall allow users to mute/unmute microphone
- **FR-4.4**: System shall allow users to enable/disable camera
- **FR-4.5**: System shall provide in-call text chat functionality

#### 3.4.2 Call Management
- **FR-4.6**: System shall notify patients when doctor initiates video call
- **FR-4.7**: System shall allow either party to end the call
- **FR-4.8**: System shall update appointment status to completed after call ends
- **FR-4.9**: System shall handle call signaling via Socket.IO (offer, answer, ICE candidates)

### 3.5 Health Tracking System

#### 3.5.1 Manual Health Tracking
- **FR-5.1**: System shall allow patients to manually log health metrics
- **FR-5.2**: System shall support multiple tracker types: blood sugar, blood pressure, heart rate, weight
- **FR-5.3**: System shall store values with units and timestamps
- **FR-5.4**: System shall allow patients to add notes to health entries

#### 3.5.2 AI-Based Health Monitoring
- **FR-5.5**: System shall support camera-based heart rate monitoring using RPPG (Remote Photoplethysmography)
- **FR-5.6**: System shall support SpO2 measurement via camera
- **FR-5.7**: System shall assign confidence levels (high, medium, low) to AI measurements
- **FR-5.8**: System shall allow patients to delete health tracker entries

### 3.6 Prescription Management

#### 3.6.1 Prescription Creation
- **FR-6.1**: System shall allow doctors to create prescriptions after video consultations
- **FR-6.2**: System shall support multiple medications per prescription
- **FR-6.3**: System shall include dosage, duration, and notes for each medication
- **FR-6.4**: System shall link prescriptions to specific appointments

#### 3.6.2 Prescription Viewing & Download
- **FR-6.5**: System shall allow patients to view their prescriptions
- **FR-6.6**: System shall allow doctors to view prescriptions they've issued
- **FR-6.7**: System shall generate downloadable PDF documents for prescriptions

### 3.7 Payment Processing

#### 3.7.1 Payment Initiation
- **FR-7.1**: System shall support multiple payment gateways (Chapa, Telebirr)
- **FR-7.2**: System shall generate unique transaction references
- **FR-7.3**: System shall allow patients to upload payment receipts
- **FR-7.4**: System shall track payment status (pending, paid, failed)

#### 3.7.2 Payment Verification
- **FR-7.5**: System shall allow administrators to verify payments
- **FR-7.6**: System shall allow administrators to reject payments with reason
- **FR-7.7**: System shall display payment history to patients
- **FR-7.8**: System shall confirm appointments only after payment verification

### 3.8 Blog Management

#### 3.8.1 Blog Publishing
- **FR-8.1**: System shall allow administrators to create blog posts
- **FR-8.2**: System shall support cover image uploads for blog posts
- **FR-8.3**: System shall allow administrators to edit and delete blog posts
- **FR-8.4**: System shall display blogs sorted by publication date

#### 3.8.2 Blog Interaction
- **FR-8.5**: System shall allow authenticated users to like/unlike blog posts
- **FR-8.6**: System shall display like counts for each blog
- **FR-8.7**: System shall allow users to share blog posts
- **FR-8.8**: System shall provide search and category filtering for blogs

### 3.9 Lab Order Management

#### 3.9.1 Lab Order Creation
- **FR-9.1**: System shall allow doctors to order lab tests
- **FR-9.2**: System shall track lab order status (pending, completed)
- **FR-9.3**: System shall allow doctors to add lab results
- **FR-9.4**: System shall allow patients to view lab results

### 3.10 Notification System

#### 3.10.1 Real-time Notifications
- **FR-10.1**: System shall send real-time notifications via Socket.IO
- **FR-10.2**: System shall notify patients when doctor starts video call
- **FR-10.3**: System shall display toast notifications for important events
- **FR-10.4**: System shall track missed call notifications

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-1**: System shall respond to API requests within 2 seconds under normal load
- **NFR-2**: Video calls shall maintain latency below 500ms for acceptable quality
- **NFR-3**: System shall support concurrent video consultations for multiple doctor-patient pairs

### 4.2 Security
- **NFR-4**: All passwords shall be hashed using bcrypt with minimum 10 salt rounds
- **NFR-5**: All API endpoints shall use HTTPS in production
- **NFR-6**: JWT tokens shall expire after 24 hours
- **NFR-7**: System shall implement CORS restrictions to prevent cross-origin attacks
- **NFR-8**: File uploads shall be validated for type and size (max 5MB)

### 4.3 Reliability
- **NFR-9**: System shall maintain 99% uptime during business hours
- **NFR-10**: Database connections shall be automatically re-established on failure
- **NFR-11**: System shall handle WebSocket disconnections gracefully

### 4.4 Scalability
- **NFR-12**: Database schema shall support horizontal scaling
- **NFR-13**: System shall be deployable on cloud infrastructure (AWS, Azure, etc.)
- **NFR-14**: Static files shall be served via CDN in production

### 4.5 Usability
- **NFR-15**: Interface shall be responsive and mobile-friendly
- **NFR-16**: System shall provide clear error messages to users
- **NFR-17**: Navigation shall be intuitive with clear role-based dashboards

---

## 5. Data Models

### 5.1 User Model
```javascript
{
  _id: ObjectId,
  full_name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['patient', 'doctor', 'admin'],
  gender: String,
  age: Number,
  phone: String,
  avatar_url: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 Doctor Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  specialty: String,
  bio: String,
  rating: Number (0-5),
  years_experience: Number,
  is_verified: Boolean,
  consultation_fee: Number,
  availability: Array [{ day: String, slots: Array[String] }],
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 Appointment Model
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  scheduled_at: Date,
  status: Enum ['upcoming', 'completed', 'cancelled'],
  video_room_id: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.4 Tracker Model
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User),
  tracker_type: Enum ['blood_sugar', 'blood_pressure', 'heart_rate', 'weight'],
  value: Number,
  unit: String,
  note: String,
  source: Enum ['manual', 'rppg_camera', 'spo2_camera'],
  confidence: Enum ['high', 'medium', 'low'],
  consultation: ObjectId (ref: Appointment),
  recorded_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.5 Prescription Model
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  appointment: ObjectId (ref: Appointment),
  medications: Array [{
    medication: String,
    dosage: String,
    duration: String,
    notes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 5.6 Payment Model
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  appointment: ObjectId (ref: Appointment),
  amount: Number,
  currency: String (default: 'ETB'),
  gateway: Enum ['chapa', 'telebirr'],
  status: Enum ['pending', 'paid', 'failed'],
  tx_ref: String,
  receipt_url: String,
  paid_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.7 Blog Model
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User),
  title: String,
  content: String,
  cover_image_url: String,
  category: String,
  likes: Array [ObjectId (ref: User)],
  published_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. API Endpoints

### 6.1 Authentication Endpoints
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/admin-login       - Admin login
GET    /api/auth/me                - Get current user (protected)
POST   /api/auth/forgot-password   - Password reset request
```

### 6.2 Doctor Endpoints
```
GET    /api/doctors                - List all doctors (protected)
GET    /api/doctors/:id            - Get doctor by ID (protected)
GET    /api/doctors/:id/slots      - Get available slots (protected)
POST   /api/doctors/schedule       - Set doctor schedule (protected)
GET    /api/doctors/my-patients    - Get doctor's patients (protected)
```

### 6.3 Appointment Endpoints
```
POST   /api/appointments           - Create appointment (protected)
GET    /api/appointments/patient/mine  - Get patient appointments (protected)
GET    /api/appointments/doctor/mine   - Get doctor appointments (protected)
DELETE /api/appointments/:id       - Cancel appointment (protected)
POST   /api/appointments/:id/verify-call - Verify call eligibility (protected)
```

### 6.4 Video Call Endpoints
```
POST   /api/call/create-room       - Create video room (protected)
POST   /api/call/end-room          - End video call (protected)
```

### 6.5 Health Tracker Endpoints
```
POST   /api/trackers               - Add tracker entry (protected)
GET    /api/trackers               - Get user's trackers (protected)
DELETE /api/trackers/:id           - Delete tracker entry (protected)
```

### 6.6 Prescription Endpoints
```
POST   /api/prescriptions          - Create prescription (protected)
GET    /api/prescriptions/my-prescriptions - Get patient prescriptions (protected)
GET    /api/prescriptions/doctor/mine - Get doctor prescriptions (protected)
GET    /api/prescriptions/:id/download - Download PDF (protected)
```

### 6.7 Payment Endpoints
```
POST   /api/payments/initiate      - Initialize payment (protected)
POST   /api/payments/:id/receipt   - Upload receipt (protected)
GET    /api/payments/:id           - Get payment status (protected)
GET    /api/admin/payments         - Admin view all payments (protected)
PATCH  /api/admin/payments/:id/verify - Admin verify payment (protected)
PATCH  /api/admin/payments/:id/reject - Admin reject payment (protected)
```

### 6.8 Blog Endpoints
```
GET    /api/blogs                  - Get all blogs (public)
GET    /api/blogs/:id              - Get single blog (public)
POST   /api/blogs                  - Create blog (admin only)
PUT    /api/blogs/:id              - Update blog (admin only)
DELETE /api/blogs/:id              - Delete blog (admin only)
PATCH  /api/blogs/:id/like         - Toggle like (authenticated)
```

### 6.9 Admin Endpoints
```
GET    /api/admin/patients         - View all patients (admin)
GET    /api/admin/doctors          - View all doctors (admin)
PATCH  /api/admin/doctors/:id/approve - Approve doctor (admin)
GET    /api/admin/doctor/earnings/:doctorId - Get doctor earnings (admin)
```

---

## 7. Frontend Routes

### 7.1 Public Routes
```
/                    - Redirects to /home
/home                - Landing page
/login               - Login page
/register            - Registration page
/forgot-password     - Password reset request
/reset-password      - Password reset form
```

### 7.2 Patient Routes (Protected)
```
/patient             - Patient dashboard
/patient/appointments - View appointments
/patient/doctors     - Find and book doctors
/patient/prescriptions - View prescriptions
/patient/lab-results - View lab results
/patient/vitals      - Health tracking
/patient/billing     - Payment management
/patient/blogs       - View health blogs
/patient/settings    - Account settings
```

### 7.3 Doctor Routes (Protected)
```
/doctor              - Doctor dashboard
/doctor/appointments - View scheduled appointments
/doctor/patients     - View patient list
/doctor/prescriptions - View issued prescriptions
/doctor/lab-orders   - Manage lab orders
/doctor/vitals       - View patient health data
/doctor/blogs        - Create/view blog posts
/doctor/earnings     - View earnings
/doctor/schedule     - Manage availability
/doctor/settings     - Account settings
```

### 7.4 Admin Routes (Protected)
```
/admin               - Admin dashboard
/admin/users         - User management
/admin/doctors       - Doctor verification
/admin/appointments  - Appointment overview
/admin/medical-records - Medical records access
/admin/blogs         - Blog content management
/admin/payments      - Payment verification
/admin/notifications - Notification management
/admin/settings      - System settings
```

### 7.5 Consultation Routes
```
/video-call/:appointmentId - Video consultation interface
```

---

## 8. Socket.IO Events

### 8.1 Video Call Signaling
```
join-room          - User joins video consultation room
offer              - WebRTC offer signal
answer             - WebRTC answer signal
ice-candidate      - ICE candidate exchange
end-call           - Terminate video call
user-joined        - Notify when user joins room
call-ended         - Notify when call ends
```

### 8.2 In-Call Communication
```
chat-message       - Send text message during call
```

### 8.3 Call Notifications
```
call-started-{patientId}  - Notify patient of incoming call
call-missed-{patientId}   - Notify patient of missed call
```

---

## 9. Implementation Status

### 9.1 Completed Features
- ✅ User authentication and authorization (JWT)
- ✅ Role-based access control (Patient, Doctor, Admin)
- ✅ Doctor profile management and verification
- ✅ Appointment booking and management
- ✅ Video consultation with WebRTC
- ✅ Real-time chat during video calls
- ✅ Health tracking (manual + camera-based)
- ✅ Prescription creation and PDF generation
- ✅ Payment processing (Chapa, Telebirr)
- ✅ Payment verification by admin
- ✅ Blog management (CRUD operations)
- ✅ Blog like/unlike functionality
- ✅ Doctor schedule management
- ✅ Patient and doctor dashboards
- ✅ Lab order creation and management
- ✅ Real-time notifications via Socket.IO

### 9.2 Partially Implemented Features
- ⏳ Email notifications (model exists, routes minimal)
- ⏳ SMS notifications (not implemented)
- ⏳ Direct messaging system (model exists, not implemented)
- ⏳ Call recording (not implemented)
- ⏳ Screen sharing during calls (not implemented)

### 9.3 Planned Future Features
- 📋 AI-powered health insights
- 📋 Integration with wearable devices
- 📋 Multi-language support
- 📋 Mobile application (React Native)
- 📋 Advanced analytics dashboard
- 📋 Integration with electronic health records (EHR)

---

## 10. Security Considerations

### 10.1 Authentication Security
- JWT tokens with 24-hour expiration
- Password hashing with bcrypt (10+ salt rounds)
- Protected routes with authentication middleware
- Role-based authorization checks

### 10.2 Data Security
- MongoDB connection via secure connection string
- Input validation on all API endpoints
- File upload restrictions (type and size validation)
- CORS configuration to prevent unauthorized access

### 10.3 Communication Security
- HTTPS required in production
- WebSocket connection validation
- WebRTC secure signaling
- Sensitive data encryption at rest

---

## 11. Deployment Architecture

### 11.1 Development Environment
- Frontend: Vite dev server on port 5173
- Backend: Express server on port 3001
- Database: MongoDB Atlas (cloud)
- Local file storage for uploads

### 11.2 Production Recommendations
- Frontend: Deploy to Vercel, Netlify, or AWS S3 + CloudFront
- Backend: Deploy to AWS EC2, Heroku, or DigitalOcean
- Database: MongoDB Atlas or AWS DocumentDB
- File Storage: AWS S3 or Cloudinary for media files
- CDN: CloudFront for static assets
- Load Balancer: AWS ALB for backend scaling
- SSL/TLS: Let's Encrypt or AWS Certificate Manager

---

## 12. Testing Strategy

### 12.1 Unit Testing
- Test individual controller functions
- Test model validations
- Test utility functions
- Test middleware logic

### 12.2 Integration Testing
- Test API endpoint workflows
- Test database operations
- Test authentication flows
- Test payment gateway integrations

### 12.3 End-to-End Testing
- Test complete user journeys (registration → booking → consultation → payment)
- Test video call functionality
- Test cross-browser compatibility
- Test mobile responsiveness

### 12.4 Performance Testing
- Load testing for concurrent users
- Video call quality testing
- Database query optimization
- API response time monitoring

---

## 13. Maintenance and Support

### 13.1 Monitoring
- Application performance monitoring (APM)
- Error tracking and logging
- Database performance metrics
- WebSocket connection health

### 13.2 Backup Strategy
- Daily database backups
- Backup retention policy (30 days)
- Disaster recovery plan
- Data restoration procedures

### 13.3 Update Process
- Semantic versioning for releases
- Database migration scripts
- Feature flagging for new features
- Rollback procedures

---

## 14. Project Structure

```
Tenaye-Health-Remote-Monitoring-Platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, environment)
│   │   ├── controllers/     # Business logic controllers
│   │   ├── handlers/        # Video call handlers
│   │   ├── middleware/      # Auth, rate limiting
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Main server entry point
│   ├── uploads/             # File upload directory
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components (Patient, Doctor, Admin)
│   │   ├── routes/         # Route definitions
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json
│   └── .env                # Environment variables
├── docs/                   # Documentation
├── BACKEND_FEATURES.md      # Backend feature documentation
├── Progress.md             # Project progress tracking
├── README.md               # Project overview
└── .gitignore
```

---

## 15. Conclusion

The Tenaye Health Remote Monitoring Platform is a comprehensive telemedicine solution that addresses the growing need for remote healthcare services. The system provides a complete ecosystem for patients, doctors, and administrators to interact seamlessly through a web-based interface.

Key strengths of the implementation include:
- Modern technology stack with React and Node.js
- Real-time communication via WebRTC and Socket.IO
- Comprehensive role-based access control
- Integration with local payment gateways (Chapa, Telebirr)
- AI-enhanced health monitoring capabilities
- Scalable architecture suitable for production deployment

The platform is production-ready with core features fully implemented and tested. Future enhancements will focus on advanced AI features, mobile application development, and integration with external healthcare systems.

---

**Document Version:** 1.0  
**Last Updated:** May 19, 2026  
**Contact:** Project Development Team
