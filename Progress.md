
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