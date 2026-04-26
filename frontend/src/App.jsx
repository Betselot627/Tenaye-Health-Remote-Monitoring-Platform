import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Public
import Home from "./pages/Home/Home";

// Patient (protected)
import Dashboard from "./pages/Dashboard/Dashboard";
import DoctorSearch from "./pages/Doctors/DoctorSearch";
import DoctorProfile from "./pages/Doctors/DoctorProfile";
import BookAppointment from "./pages/Appointments/BookAppointment";
import MyAppointments from "./pages/Appointments/MyAppointments";
import MedicalInfo from "./pages/Medical/MedicalInfo";
import HealthData from "./pages/Medical/HealthData";
import Trackers from "./pages/Medical/Trackers";
import Prescriptions from "./pages/Medical/Prescriptions";
import LabOrders from "./pages/Medical/LabOrders";
import VideoCall from "./pages/Consultation/VideoCall";
import BlogList from "./pages/Blogs/BlogList";
import BlogDetail from "./pages/Blogs/BlogDetail";
import Billing from "./pages/Billing/Billing";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Profile/Settings";

// Doctor Portal (protected)
import DoctorDashboard from "./pages/Doctor/Dashboard";
import DoctorAppointments from "./pages/Doctor/Appointments";
import DoctorPatients from "./pages/Doctor/Patients";
import DoctorPrescriptions from "./pages/Doctor/Prescriptions";
import DoctorLabOrders from "./pages/Doctor/LabOrders";
import DoctorVitals from "./pages/Doctor/Vitals";
import DoctorBlogs from "./pages/Doctor/Blogs";
import DoctorEarnings from "./pages/Doctor/Earnings";
import DoctorSchedule from "./pages/Doctor/Schedule";
import DoctorSettings from "./pages/Doctor/Settings";

// Admin (protected)
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminDoctors from "./pages/Admin/Doctors";
import AdminAppointments from "./pages/Admin/Appointments";
import AdminMedicalRecords from "./pages/Admin/MedicalRecords";
import AdminBlogs from "./pages/Admin/Blogs";
import AdminPayments from "./pages/Admin/Payments";
import AdminNotifications from "./pages/Admin/Notifications";
import AdminSettings from "./pages/Admin/Settings";
import AdminSearchResults from "./pages/Admin/SearchResults";

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Patient — protected */}
        <Route
          path="/dashboard"
          element={
            <P>
              <Dashboard />
            </P>
          }
        />
        <Route
          path="/doctors"
          element={
            <P>
              <DoctorSearch />
            </P>
          }
        />
        <Route
          path="/doctors/:id"
          element={
            <P>
              <DoctorProfile />
            </P>
          }
        />
        <Route
          path="/appointments"
          element={
            <P>
              <MyAppointments />
            </P>
          }
        />
        <Route
          path="/appointments/book/:doctorId"
          element={
            <P>
              <BookAppointment />
            </P>
          }
        />
        <Route
          path="/medical"
          element={
            <P>
              <MedicalInfo />
            </P>
          }
        />
        <Route
          path="/medical/health-data"
          element={
            <P>
              <HealthData />
            </P>
          }
        />
        <Route
          path="/medical/trackers"
          element={
            <P>
              <Trackers />
            </P>
          }
        />
        <Route
          path="/medical/prescriptions"
          element={
            <P>
              <Prescriptions />
            </P>
          }
        />
        <Route
          path="/medical/lab-orders"
          element={
            <P>
              <LabOrders />
            </P>
          }
        />
        <Route
          path="/consultation/:roomId"
          element={
            <P>
              <VideoCall />
            </P>
          }
        />
        <Route
          path="/blogs"
          element={
            <P>
              <BlogList />
            </P>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <P>
              <BlogDetail />
            </P>
          }
        />
        <Route
          path="/billing"
          element={
            <P>
              <Billing />
            </P>
          }
        />
        <Route
          path="/profile"
          element={
            <P>
              <Profile />
            </P>
          }
        />
        <Route
          path="/settings"
          element={
            <P>
              <Settings />
            </P>
          }
        />

        {/* Doctor Portal — protected */}
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

        {/* Admin — protected */}
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

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
