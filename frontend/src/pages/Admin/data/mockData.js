/**
 * mockData.js — Admin Panel Mock Data
 *
 * PURPOSE:
 *   All admin pages currently use this file directly instead of real API calls.
 *   When backend integration begins, replace each export with the corresponding
 *   API service call. The shape of each object here matches what the API should return.
 *
 * HOW TO INTEGRATE:
 *   1. Create the matching service function in src/services/
 *   2. Replace the import in each admin page:
 *        BEFORE: import { mockUsers } from "./data/mockData"
 *        AFTER:  import { getUsers } from "../../services/userService"
 *   3. Wrap in useEffect + useState (or a custom hook / Zustand store)
 *   4. Add loading and error states to the UI
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */


/**
 * STATS — Dashboard summary counters
 *
 * API endpoint:  GET /api/admin/stats
 * Response shape:
 * {
 *   totalPatients:   number,   // total registered patient accounts
 *   activeDoctors:   number,   // doctors with status === "approved"
 *   appointmentsToday: number, // appointments scheduled for today
 *   totalRevenue:    number,   // lifetime revenue in ETB (smallest unit: birr)
 *   pendingDoctors:  number,   // doctors with status === "pending"
 *   blockedUsers:    number,   // patients with status === "blocked"
 *   pendingBlogs:    number,   // blog posts with status === "pending"
 *   failedPayments:  number,   // transactions with status === "failed"
 * }
 */
export const mockStats = {
  totalPatients: 12489,
  activeDoctors: 1204,
  appointmentsToday: 842,
  totalRevenue: 8400000,
  pendingDoctors: 24,
  blockedUsers: 42,
  pendingBlogs: 8,
  failedPayments: 7,
};


/**
 * USERS — Patient accounts
 *
 * API endpoint:  GET /api/admin/users?page=1&limit=20&status=all&search=
 * Response shape: { data: User[], total: number, page: number, limit: number }
 *
 * User {
 *   id:         string,   // UUID
 *   name:       string,   // full name
 *   email:      string,
 *   age:        number,
 *   gender:     "Male" | "Female" | "Other",
 *   role:       "patient",
 *   status:     "active" | "blocked" | "pending",
 *   lastActive: string,   // human-readable relative time, e.g. "2 hours ago"
 *                         // backend: derive from last_login_at timestamp
 * }
 *
 * Actions:
 *   Block user:   PATCH /api/admin/users/:id  { status: "blocked" }
 *   Unblock user: PATCH /api/admin/users/:id  { status: "active" }
 */
export const mockUsers = [
  { id: "1", name: "Bereket Tadesse", email: "bereket@email.com", age: 28, gender: "Male", role: "patient", status: "active", lastActive: "2 hours ago" },
  { id: "2", name: "Sara Haile", email: "sara@email.com", age: 34, gender: "Female", role: "patient", status: "blocked", lastActive: "3 days ago" },
  { id: "3", name: "Yonas Bekele", email: "yonas@email.com", age: 45, gender: "Male", role: "patient", status: "active", lastActive: "15 mins ago" },
  { id: "4", name: "Tigist Worku", email: "tigist@email.com", age: 29, gender: "Female", role: "patient", status: "pending", lastActive: "1 day ago" },
  { id: "5", name: "Abebe Girma", email: "abebe@email.com", age: 52, gender: "Male", role: "patient", status: "active", lastActive: "Just now" },
];


/**
 * DOCTORS — Practitioner accounts
 *
 * API endpoint:  GET /api/admin/doctors?page=1&limit=20&status=all
 * Response shape: { data: Doctor[], total: number, page: number, limit: number }
 *
 * Doctor {
 *   id:         string,   // UUID
 *   name:       string,   // full name including "Dr." prefix
 *   specialty:  string,   // medical specialty
 *   experience: string,   // e.g. "12 Years" — backend: derive from years_of_experience number
 *   rating:     number,   // average rating 0–5, 2 decimal places
 *   status:     "pending" | "approved" | "suspended",
 *   fee:        number,   // consultation fee in ETB
 * }
 *
 * Actions:
 *   Approve:   PATCH /api/admin/doctors/:id  { status: "approved" }
 *   Reject:    DELETE /api/admin/doctors/:id/application
 *   Suspend:   PATCH /api/admin/doctors/:id  { status: "suspended" }
 *   Reinstate: PATCH /api/admin/doctors/:id  { status: "approved" }
 */
export const mockDoctors = [
  { id: "1", name: "Dr. Alem Bekele", specialty: "Cardiology", experience: "12 Years", rating: 4.8, status: "pending", fee: 500 },
  { id: "2", name: "Dr. Tigist Worku", specialty: "Neurology", experience: "8 Years", rating: 4.9, status: "approved", fee: 600 },
  { id: "3", name: "Dr. Michael Chen", specialty: "Endocrinology", experience: "15 Years", rating: 5.0, status: "pending", fee: 700 },
  { id: "4", name: "Dr. Sara Jenkins", specialty: "General Practice", experience: "5 Years", rating: 4.7, status: "approved", fee: 400 },
  { id: "5", name: "Dr. Robert Kovac", specialty: "Psychiatry", experience: "10 Years", rating: 4.6, status: "suspended", fee: 550 },
];


/**
 * APPOINTMENTS — Scheduled consultations
 *
 * API endpoint:  GET /api/admin/appointments?page=1&limit=20&status=all&date=
 * Response shape: { data: Appointment[], total: number, page: number, limit: number }
 *
 * Appointment {
 *   id:        string,   // e.g. "APT-001" — backend: use UUID or sequential ID
 *   patient:   string,   // patient full name — backend: join from users table
 *   doctor:    string,   // doctor full name — backend: join from doctors table
 *   specialty: string,   // doctor's specialty
 *   date:      string,   // ISO date string "YYYY-MM-DD"
 *   time:      string,   // human-readable "10:00 AM" — backend: derive from datetime
 *   duration:  string,   // e.g. "30 min" — backend: derive from duration_minutes number
 *   status:    "upcoming" | "completed" | "in_progress" | "cancelled" | "no_show",
 * }
 *
 * Actions:
 *   Cancel: PATCH /api/admin/appointments/:id  { status: "cancelled" }
 */
export const mockAppointments = [
  { id: "APT-001", patient: "Bereket Tadesse", doctor: "Dr. Alem Bekele", specialty: "Cardiology", date: "2025-04-26", time: "10:00 AM", duration: "30 min", status: "upcoming" },
  { id: "APT-002", patient: "Sara Haile", doctor: "Dr. Tigist Worku", specialty: "Neurology", date: "2025-04-26", time: "11:30 AM", duration: "45 min", status: "completed" },
  { id: "APT-003", patient: "Yonas Bekele", doctor: "Dr. Michael Chen", specialty: "Endocrinology", date: "2025-04-26", time: "02:00 PM", duration: "30 min", status: "in_progress" },
  { id: "APT-004", patient: "Tigist Worku", doctor: "Dr. Sara Jenkins", specialty: "General Practice", date: "2025-04-25", time: "09:00 AM", duration: "30 min", status: "cancelled" },
  { id: "APT-005", patient: "Abebe Girma", doctor: "Dr. Robert Kovac", specialty: "Psychiatry", date: "2025-04-27", time: "03:00 PM", duration: "60 min", status: "upcoming" },
];


/**
 * BLOGS — Health content posts
 *
 * API endpoint:  GET /api/admin/blogs?page=1&limit=20&status=all
 * Response shape: { data: Blog[], total: number, page: number, limit: number }
 *
 * Blog {
 *   id:       string,   // UUID
 *   title:    string,
 *   author:   string,   // author display name — backend: join from users/doctors table
 *   category: string,   // e.g. "Technology", "Cardiology"
 *   date:     string,   // ISO date string "YYYY-MM-DD"
 *   status:   "pending" | "published" | "flagged" | "draft",
 *   likes:    number,   // total like count
 * }
 *
 * Actions:
 *   Publish: PATCH /api/admin/blogs/:id  { status: "published" }
 *   Flag:    PATCH /api/admin/blogs/:id  { status: "flagged" }
 *   Delete:  DELETE /api/admin/blogs/:id
 */
export const mockBlogs = [
  { id: "1", title: "The Future of rPPG in Remote Care", author: "Dr. Alem Bekele", category: "Technology", date: "2025-04-24", status: "pending", likes: 1300 },
  { id: "2", title: "Managing Diabetes with Smart Monitoring", author: "Dr. Michael Chen", category: "Diabetes", date: "2025-04-23", status: "published", likes: 2100 },
  { id: "3", title: "Heart Health Tips for 2025", author: "Dr. Tigist Worku", category: "Cardiology", date: "2025-04-22", status: "published", likes: 890 },
  { id: "4", title: "Holistic Supplements for Heart Health", author: "User-HealthExpert99", category: "Nutrition", date: "2025-04-21", status: "flagged", likes: 450 },
  { id: "5", title: "Understanding Blood Pressure Readings", author: "Dr. Sara Jenkins", category: "General", date: "2025-04-20", status: "draft", likes: 0 },
];


/**
 * PAYMENTS — Transaction records
 *
 * API endpoint:  GET /api/admin/payments?page=1&limit=20&status=all
 * Response shape: { data: Payment[], total: number, page: number, limit: number }
 *
 * Payment {
 *   id:      string,   // e.g. "TXN-001" — backend: use gateway transaction ID
 *   patient: string,   // patient full name — backend: join from users table
 *   doctor:  string,   // doctor full name — backend: join from doctors table
 *   amount:  number,   // amount in ETB
 *   gateway: "chapa" | "receipt_upload",
 *   date:    string,   // ISO date string "YYYY-MM-DD"
 *   status:  "paid" | "pending" | "failed" | "refunded",
 * }
 *
 * Actions:
 *   Refund: POST /api/admin/payments/:id/refund
 *   View receipt: GET /api/admin/payments/:id/receipt
 */
export const mockPayments = [
  { id: "TXN-001", patient: "Bereket Tadesse", doctor: "Dr. Alem Bekele", amount: 500, gateway: "chapa", date: "2025-04-26", status: "paid" },
  { id: "TXN-002", patient: "Sara Haile", doctor: "Dr. Tigist Worku", amount: 600, gateway: "receipt_upload", date: "2025-04-25", status: "paid" },
  { id: "TXN-003", patient: "Yonas Bekele", doctor: "Dr. Michael Chen", amount: 700, gateway: "chapa", date: "2025-04-25", status: "pending" },
  { id: "TXN-004", patient: "Tigist Worku", doctor: "Dr. Sara Jenkins", amount: 400, gateway: "receipt_upload", date: "2025-04-24", status: "failed" },
  { id: "TXN-005", patient: "Abebe Girma", doctor: "Dr. Robert Kovac", amount: 550, gateway: "chapa", date: "2025-04-24", status: "refunded" },
];


/**
 * NOTIFICATIONS — System and user alerts
 *
 * API endpoint:  GET /api/admin/notifications?page=1&limit=20&type=all&read=all
 * Response shape: { data: Notification[], total: number, unreadCount: number }
 *
 * Notification {
 *   id:        string,   // UUID
 *   type:      "vital_alert" | "appointment" | "payment" | "system" | "blog",
 *   title:     string,
 *   message:   string,
 *   recipient: string,   // display name of the target user
 *   time:      string,   // human-readable relative time — backend: derive from created_at
 *   read:      boolean,
 * }
 *
 * Actions:
 *   Mark read:    PATCH /api/admin/notifications/:id  { read: true }
 *   Mark all read: PATCH /api/admin/notifications/read-all
 *   Delete:       DELETE /api/admin/notifications/:id
 *
 * Broadcast:
 *   POST /api/admin/notifications/broadcast
 *   Body: { title: string, message: string, target: "all" | "patients" | "doctors" }
 */
export const mockNotifications = [
  { id: "1", type: "vital_alert", title: "Critical Vital Alert", message: "Patient Bereket Tadesse — critical SpO2: 88%", recipient: "Dr. Alem Bekele", time: "2 mins ago", read: false },
  { id: "2", type: "appointment", title: "Appointment Confirmed", message: "Appointment APT-005 confirmed for April 27", recipient: "Abebe Girma", time: "15 mins ago", read: false },
  { id: "3", type: "payment", title: "Payment Processed", message: "Payment of 500 ETB received via Chapa", recipient: "Bereket Tadesse", time: "1 hour ago", read: true },
  { id: "4", type: "system", title: "System Backup Complete", message: "Automated backup completed successfully", recipient: "System", time: "3 hours ago", read: true },
  { id: "5", type: "blog", title: "Blog Post Pending Review", message: "New post submitted by Dr. Alem Bekele", recipient: "Admin", time: "4 hours ago", read: false },
];


/**
 * ACTIVITY — Recent admin audit log entries
 *
 * API endpoint:  GET /api/admin/activity?page=1&limit=10
 * Response shape: { data: ActivityItem[] }
 *
 * ActivityItem {
 *   id:   string,   // UUID
 *   text: string,   // primary description of the event
 *   sub:  string,   // secondary detail (patient name, category, etc.)
 *   time: string,   // human-readable relative time — backend: derive from created_at
 * }
 *
 * Note: This is a read-only log. No write actions from the admin UI.
 */
export const mockActivity = [
  { id: "1", text: "Dr. Sara Jenkins completed consultation", sub: "Patient: Bereket Tadesse (Cardiology)", time: "2m ago" },
  { id: "2", text: "New appointment scheduled", sub: "Patient: Yonas Bekele (General Checkup)", time: "15m ago" },
  { id: "3", text: "Revenue target achieved", sub: "Daily revenue surpassed 300k ETB", time: "1h ago" },
  { id: "4", text: "New doctor application received", sub: "Dr. Alem Bekele — Cardiology", time: "2h ago" },
];
