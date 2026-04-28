import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// ─── PUBLIC ───────────────────────────────────────────────────────────────────
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// ─── ADMIN ────────────────────────────────────────────────────────────────────
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminUsers from "../pages/Admin/Users";
import AdminDoctors from "../pages/Admin/Doctors";
import AdminAppointments from "../pages/Admin/Appointments";
import AdminMedicalRecords from "../pages/Admin/MedicalRecords";
import AdminBlogs from "../pages/Admin/Blogs";
import AdminPayments from "../pages/Admin/Payments";
import AdminNotifications from "../pages/Admin/Notifications";
import AdminSettings from "../pages/Admin/Settings";
import AdminSearchResults from "../pages/Admin/SearchResults";

// ─── DOCTOR ───────────────────────────────────────────────────────────────────
import DoctorDashboard from "../pages/Doctor/Dashboard";
import DoctorAppointments from "../pages/Doctor/Appointments";
import DoctorPatients from "../pages/Doctor/Patients";
import DoctorPrescriptions from "../pages/Doctor/Prescriptions";
import DoctorLabOrders from "../pages/Doctor/LabOrders";
import DoctorVitals from "../pages/Doctor/Vitals";
import DoctorBlogs from "../pages/Doctor/Blogs";
import DoctorEarnings from "../pages/Doctor/Earnings";
import DoctorSchedule from "../pages/Doctor/Schedule";
import DoctorSettings from "../pages/Doctor/Settings";

// ─── PATIENT ──────────────────────────────────────────────────────────────────
// TODO: Patient team will add pages here under pages/Patient/
// import PatientDashboard from "../pages/Patient/Dashboard";
// import PatientDoctors from "../pages/Patient/Doctors";
// import PatientAppointments from "../pages/Patient/Appointments";
// import PatientBilling from "../pages/Patient/Billing";
// import PatientBlogs from "../pages/Patient/Blogs";
// import PatientProfile from "../pages/Patient/Profile";
// import PatientSettings from "../pages/Patient/Settings";

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Routes>

      {/* ── Default ── */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ── Public ── */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ── Admin ── */}
      <Route path="/admin" element={<P><AdminDashboard /></P>} />
      <Route path="/admin/search" element={<P><AdminSearchResults /></P>} />
      <Route path="/admin/users" element={<P><AdminUsers /></P>} />
      <Route path="/admin/doctors" element={<P><AdminDoctors /></P>} />
      <Route path="/admin/appointments" element={<P><AdminAppointments /></P>} />
      <Route path="/admin/medical-records" element={<P><AdminMedicalRecords /></P>} />
      <Route path="/admin/blogs" element={<P><AdminBlogs /></P>} />
      <Route path="/admin/payments" element={<P><AdminPayments /></P>} />
      <Route path="/admin/notifications" element={<P><AdminNotifications /></P>} />
      <Route path="/admin/settings" element={<P><AdminSettings /></P>} />

      {/* ── Doctor ── */}
      {/* NOTE FOR TEAMMATE: /doctor route is not showing dashboard — check DoctorLayout nav */}
      <Route path="/doctor" element={<P><DoctorDashboard /></P>} />
      <Route path="/doctor/appointments" element={<P><DoctorAppointments /></P>} />
      <Route path="/doctor/patients" element={<P><DoctorPatients /></P>} />
      <Route path="/doctor/prescriptions" element={<P><DoctorPrescriptions /></P>} />
      <Route path="/doctor/lab-orders" element={<P><DoctorLabOrders /></P>} />
      <Route path="/doctor/vitals" element={<P><DoctorVitals /></P>} />
      <Route path="/doctor/blogs" element={<P><DoctorBlogs /></P>} />
      <Route path="/doctor/earnings" element={<P><DoctorEarnings /></P>} />
      <Route path="/doctor/schedule" element={<P><DoctorSchedule /></P>} />
      <Route path="/doctor/settings" element={<P><DoctorSettings /></P>} />

      {/* ── Patient ── */}
      {/* TODO: Uncomment when patient team adds pages under pages/Patient/ */}
      {/* <Route path="/dashboard" element={<P><PatientDashboard /></P>} /> */}
      {/* <Route path="/doctors" element={<P><PatientDoctors /></P>} /> */}
      {/* <Route path="/appointments" element={<P><PatientAppointments /></P>} /> */}
      {/* <Route path="/appointments/book/:doctorId" element={<P><PatientBookAppointment /></P>} /> */}
      {/* <Route path="/billing" element={<P><PatientBilling /></P>} /> */}
      {/* <Route path="/blogs" element={<P><PatientBlogs /></P>} /> */}
      {/* <Route path="/blogs/:id" element={<P><PatientBlogDetail /></P>} /> */}
      {/* <Route path="/profile" element={<P><PatientProfile /></P>} /> */}
      {/* <Route path="/settings" element={<P><PatientSettings /></P>} /> */}

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/home" replace />} />

    </Routes>
  );
}
