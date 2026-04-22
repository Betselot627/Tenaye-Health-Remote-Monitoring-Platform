import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Home
import Home from "./pages/Home/Home";

// Doctors
import DoctorSearch from "./pages/Doctors/DoctorSearch";
import DoctorProfile from "./pages/Doctors/DoctorProfile";

// Appointments
import BookAppointment from "./pages/Appointments/BookAppointment";
import MyAppointments from "./pages/Appointments/MyAppointments";

// Medical
import MedicalInfo from "./pages/Medical/MedicalInfo";
import HealthData from "./pages/Medical/HealthData";
import Trackers from "./pages/Medical/Trackers";
import Prescriptions from "./pages/Medical/Prescriptions";
import LabOrders from "./pages/Medical/LabOrders";

// Consultation
import VideoCall from "./pages/Consultation/VideoCall";

// Blogs
import BlogList from "./pages/Blogs/BlogList";
import BlogDetail from "./pages/Blogs/BlogDetail";

// Billing
import Billing from "./pages/Billing/Billing";

// Profile
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Profile/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* Doctors */}
        <Route path="/doctors" element={<DoctorSearch />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />

        {/* Appointments */}
        <Route path="/appointments" element={<MyAppointments />} />
        <Route
          path="/appointments/book/:doctorId"
          element={<BookAppointment />}
        />

        {/* Medical */}
        <Route path="/medical" element={<MedicalInfo />} />
        <Route path="/medical/health-data" element={<HealthData />} />
        <Route path="/medical/trackers" element={<Trackers />} />
        <Route path="/medical/prescriptions" element={<Prescriptions />} />
        <Route path="/medical/lab-orders" element={<LabOrders />} />

        {/* Consultation */}
        <Route path="/consultation/:roomId" element={<VideoCall />} />

        {/* Blogs */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />

        {/* Billing */}
        <Route path="/billing" element={<Billing />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
