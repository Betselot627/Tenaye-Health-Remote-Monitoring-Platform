const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get current doctor's profile
export const getDoctorProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/doctors/profile/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch doctor profile");
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Update current doctor's profile
export const updateDoctorProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/doctors/profile/me`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update doctor profile");
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
