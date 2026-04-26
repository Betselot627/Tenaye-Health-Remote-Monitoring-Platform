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

export const mockUsers = [
  { id: "1", name: "Bereket Tadesse", email: "bereket@email.com", age: 28, gender: "Male", role: "patient", status: "active", lastActive: "2 hours ago" },
  { id: "2", name: "Sara Haile", email: "sara@email.com", age: 34, gender: "Female", role: "patient", status: "blocked", lastActive: "3 days ago" },
  { id: "3", name: "Yonas Bekele", email: "yonas@email.com", age: 45, gender: "Male", role: "patient", status: "active", lastActive: "15 mins ago" },
  { id: "4", name: "Tigist Worku", email: "tigist@email.com", age: 29, gender: "Female", role: "patient", status: "pending", lastActive: "1 day ago" },
  { id: "5", name: "Abebe Girma", email: "abebe@email.com", age: 52, gender: "Male", role: "patient", status: "active", lastActive: "Just now" },
];

export const mockDoctors = [
  { id: "1", name: "Dr. Alem Bekele", specialty: "Cardiology", experience: "12 Years", rating: 4.8, status: "pending", fee: 500 },
  { id: "2", name: "Dr. Tigist Worku", specialty: "Neurology", experience: "8 Years", rating: 4.9, status: "approved", fee: 600 },
  { id: "3", name: "Dr. Michael Chen", specialty: "Endocrinology", experience: "15 Years", rating: 5.0, status: "pending", fee: 700 },
  { id: "4", name: "Dr. Sara Jenkins", specialty: "General Practice", experience: "5 Years", rating: 4.7, status: "approved", fee: 400 },
  { id: "5", name: "Dr. Robert Kovac", specialty: "Psychiatry", experience: "10 Years", rating: 4.6, status: "suspended", fee: 550 },
];

export const mockAppointments = [
  { id: "APT-001", patient: "Bereket Tadesse", doctor: "Dr. Alem Bekele", specialty: "Cardiology", date: "2025-04-26", time: "10:00 AM", duration: "30 min", status: "upcoming" },
  { id: "APT-002", patient: "Sara Haile", doctor: "Dr. Tigist Worku", specialty: "Neurology", date: "2025-04-26", time: "11:30 AM", duration: "45 min", status: "completed" },
  { id: "APT-003", patient: "Yonas Bekele", doctor: "Dr. Michael Chen", specialty: "Endocrinology", date: "2025-04-26", time: "02:00 PM", duration: "30 min", status: "in_progress" },
  { id: "APT-004", patient: "Tigist Worku", doctor: "Dr. Sara Jenkins", specialty: "General Practice", date: "2025-04-25", time: "09:00 AM", duration: "30 min", status: "cancelled" },
  { id: "APT-005", patient: "Abebe Girma", doctor: "Dr. Robert Kovac", specialty: "Psychiatry", date: "2025-04-27", time: "03:00 PM", duration: "60 min", status: "upcoming" },
];

export const mockBlogs = [
  { id: "1", title: "The Future of rPPG in Remote Care", author: "Dr. Alem Bekele", category: "Technology", date: "2025-04-24", status: "pending", likes: 1300 },
  { id: "2", title: "Managing Diabetes with Smart Monitoring", author: "Dr. Michael Chen", category: "Diabetes", date: "2025-04-23", status: "published", likes: 2100 },
  { id: "3", title: "Heart Health Tips for 2025", author: "Dr. Tigist Worku", category: "Cardiology", date: "2025-04-22", status: "published", likes: 890 },
  { id: "4", title: "Holistic Supplements for Heart Health", author: "User-HealthExpert99", category: "Nutrition", date: "2025-04-21", status: "flagged", likes: 450 },
  { id: "5", title: "Understanding Blood Pressure Readings", author: "Dr. Sara Jenkins", category: "General", date: "2025-04-20", status: "draft", likes: 0 },
];

export const mockPayments = [
  { id: "TXN-001", patient: "Bereket Tadesse", doctor: "Dr. Alem Bekele", amount: 500, gateway: "chapa", date: "2025-04-26", status: "paid" },
  { id: "TXN-002", patient: "Sara Haile", doctor: "Dr. Tigist Worku", amount: 600, gateway: "telebirr", date: "2025-04-25", status: "paid" },
  { id: "TXN-003", patient: "Yonas Bekele", doctor: "Dr. Michael Chen", amount: 700, gateway: "chapa", date: "2025-04-25", status: "pending" },
  { id: "TXN-004", patient: "Tigist Worku", doctor: "Dr. Sara Jenkins", amount: 400, gateway: "telebirr", date: "2025-04-24", status: "failed" },
  { id: "TXN-005", patient: "Abebe Girma", doctor: "Dr. Robert Kovac", amount: 550, gateway: "chapa", date: "2025-04-24", status: "refunded" },
];

export const mockNotifications = [
  { id: "1", type: "vital_alert", title: "Critical Vital Alert", message: "Patient Bereket Tadesse — critical SpO2: 88%", recipient: "Dr. Alem Bekele", time: "2 mins ago", read: false },
  { id: "2", type: "appointment", title: "Appointment Confirmed", message: "Appointment APT-005 confirmed for April 27", recipient: "Abebe Girma", time: "15 mins ago", read: false },
  { id: "3", type: "payment", title: "Payment Processed", message: "Payment of 500 ETB received via Chapa", recipient: "Bereket Tadesse", time: "1 hour ago", read: true },
  { id: "4", type: "system", title: "System Backup Complete", message: "Automated backup completed successfully", recipient: "System", time: "3 hours ago", read: true },
  { id: "5", type: "blog", title: "Blog Post Pending Review", message: "New post submitted by Dr. Alem Bekele", recipient: "Admin", time: "4 hours ago", read: false },
];

export const mockActivity = [
  { id: "1", text: "Dr. Sara Jenkins completed consultation", sub: "Patient: Bereket Tadesse (Cardiology)", time: "2m ago" },
  { id: "2", text: "New appointment scheduled", sub: "Patient: Yonas Bekele (General Checkup)", time: "15m ago" },
  { id: "3", text: "Revenue target achieved", sub: "Daily revenue surpassed 300k ETB", time: "1h ago" },
  { id: "4", text: "New doctor application received", sub: "Dr. Alem Bekele — Cardiology", time: "2h ago" },
];
