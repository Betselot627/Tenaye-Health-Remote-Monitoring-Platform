// Simple pub/sub store for doctor profile — shared between Settings and DoctorLayout
import { mockDoctorProfile } from "../data/mockData";

let state = {
  name: mockDoctorProfile.name,
  specialty: mockDoctorProfile.specialty,
  subSpecialty: mockDoctorProfile.subSpecialty,
  email: mockDoctorProfile.email,
  phone: mockDoctorProfile.phone,
  experience: mockDoctorProfile.experience,
  education: mockDoctorProfile.education,
  languages: mockDoctorProfile.languages,
  consultationFee: mockDoctorProfile.consultationFee,
  rating: mockDoctorProfile.rating,
  totalReviews: mockDoctorProfile.totalReviews,
  totalPatients: mockDoctorProfile.totalPatients,
  bio: mockDoctorProfile.bio,
  availability: mockDoctorProfile.availability,
  hospital: mockDoctorProfile.hospital,
  licenseNo: mockDoctorProfile.licenseNo,
};

const listeners = new Set();

export function getDoctorProfile() {
  return { ...state };
}

export function updateDoctorProfile(updates) {
  state = { ...state, ...updates };
  listeners.forEach((fn) => fn(state));
}

export function subscribeDoctorProfile(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
