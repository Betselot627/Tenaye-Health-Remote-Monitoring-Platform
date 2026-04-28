import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// ─── PUBLIC ───────────────────────────────────────────────────────────────────
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VideoCall from "../pages/Consultation/VideoCall";
import DoctorApply from "../pages/Auth/DoctorApply";

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
import PatientDashboard from "../pages/Patient/Dashboard";
import PatientDoctors from "../pages/Patient/Doctors";
import PatientAppointments from "../pages/Patient/Appointments";
import PatientPrescriptions from "../pages/Patient/Prescriptions";
import PatientLabResults from "../pages/Patient/LabResults";
import PatientVitals from "../pages/Patient/Vitals";
import PatientBilling from "../pages/Patient/Billing";
import PatientBlogs from "../pages/Patient/Blogs";
import PatientSettings from "../pages/Patient/Settings";
import PaymentSuccess from "../pages/Patient/PaymentSuccess";
import PaymentFailed from "../pages/Patient/PaymentFailed";

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
      <Route path="/apply-doctor" element={<DoctorApply />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ── Admin ── */}
      <Route
        path="/admin"
        element={
          <P>
            <AdminDashboard />
          </P>
        }
      />
      <Route
        path="/admin/search"
        element={
          <P>
            <AdminSearchResults />
          </P>
        }
      />
      <Route
        path="/admin/users"
        element={
          <P>
            <AdminUsers />
          </P>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <P>
            <AdminDoctors />
          </P>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <P>
            <AdminAppointments />
          </P>
        }
      />
      <Route
        path="/admin/medical-records"
        element={
          <P>
            <AdminMedicalRecords />
          </P>
        }
      />
      <Route
        path="/admin/blogs"
        element={
          <P>
            <AdminBlogs />
          </P>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <P>
            <AdminPayments />
          </P>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <P>
            <AdminNotifications />
          </P>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <P>
            <AdminSettings />
          </P>
        }
      />

      {/* ── Doctor ── */}
      {/* NOTE FOR TEAMMATE: /doctor route is not showing dashboard — check DoctorLayout nav */}
      <Route
        path="/doctor"
        element={
          <P>
            <DoctorDashboard />
          </P>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <P>
            <DoctorAppointments />
          </P>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <P>
            <DoctorPatients />
          </P>
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          <P>
            <DoctorPrescriptions />
          </P>
        }
      />
      <Route
        path="/doctor/lab-orders"
        element={
          <P>
            <DoctorLabOrders />
          </P>
        }
      />
      <Route
        path="/doctor/vitals"
        element={
          <P>
            <DoctorVitals />
          </P>
        }
      />
      <Route
        path="/doctor/blogs"
        element={
          <P>
            <DoctorBlogs />
          </P>
        }
      />
      <Route
        path="/doctor/earnings"
        element={
          <P>
            <DoctorEarnings />
          </P>
        }
      />
      <Route
        path="/doctor/schedule"
        element={
          <P>
            <DoctorSchedule />
          </P>
        }
      />
      <Route
        path="/doctor/settings"
        element={
          <P>
            <DoctorSettings />
          </P>
        }
      />

      {/* ── Patient ── */}
      <Route
        path="/patient"
        element={
          <P>
            <PatientDashboard />
          </P>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <P>
            <PatientAppointments />
          </P>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <P>
            <PatientDoctors />
          </P>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <P>
            <PatientPrescriptions />
          </P>
        }
      />
      <Route
        path="/patient/lab-results"
        element={
          <P>
            <PatientLabResults />
          </P>
        }
      />
      <Route
        path="/patient/vitals"
        element={
          <P>
            <PatientVitals />
          </P>
        }
      />
      <Route
        path="/patient/billing"
        element={
          <P>
            <PatientBilling />
          </P>
        }
      />
      <Route
        path="/patient/blogs"
        element={
          <P>
            <PatientBlogs />
          </P>
        }
      />
      <Route
        path="/patient/settings"
        element={
          <P>
            <PatientSettings />
          </P>
        }
      />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failed" element={<PaymentFailed />} />
      <Route path="/consultation/:roomId" element={<P><VideoCall /></P>} />

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
