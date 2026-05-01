/**
 * PATIENT SERVICE
 * 
 * All patient-related API calls.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ─── DOCTORS ──────────────────────────────────────────────────────────────────

export const getDoctors = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/api/doctors?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch doctor');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getMyAppointments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/appointments/mine`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getDoctorAppointments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/appointments/doctor`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

export const initiatePayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/init`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to initiate payment');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const uploadReceipt = async (paymentId, file) => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('paymentId', paymentId);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/payments/upload-receipt`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload receipt');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const verifyChapaPayment = async (txRef) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/verify-chapa/${txRef}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getPayments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
