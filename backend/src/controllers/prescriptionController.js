import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";

// Create prescription (after video call or from prescriptions page)
export const createPrescription = async (req, res) => {
  try {
    const { patient, patientId, appointmentId, medications, diagnosis, notes } = req.body;
    const doctorId = req.user._id;

    // Support both patient and patientId fields
    const targetPatientId = patient || patientId;

    if (!targetPatientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // If appointmentId provided, verify it exists and belongs to this doctor
    let appointment = null;
    if (appointmentId) {
      appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: doctorId,
        patient: targetPatientId,
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
    }

    // Create prescription
    const prescriptionData = {
      patient: targetPatientId,
      doctor: doctorId,
      medications,
      diagnosis,
      notes,
    };

    // Only add appointment if provided
    if (appointmentId) {
      prescriptionData.appointment = appointmentId;
    }

    const prescription = await Prescription.create(prescriptionData);

    // Populate and return
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate("patient", "full_name email")
      .populate("doctor", "user specialty")
      .populate("appointment", "scheduled_at");

    res.status(201).json(populatedPrescription);
  } catch (error) {
    console.error("Create prescription error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get prescriptions for current user (patient)
export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate("doctor", "user specialty")
      .populate("appointment", "scheduled_at")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error("Get prescriptions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get prescriptions for a specific patient (doctor view)
export const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;

    const prescriptions = await Prescription.find({
      patient: patientId,
      doctor: doctorId,
    })
      .populate("patient", "full_name email")
      .populate("appointment", "scheduled_at")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error("Get patient prescriptions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    let prescription;
    if (userRole === "doctor") {
      prescription = await Prescription.findOne({
        _id: id,
        doctor: userId,
      })
        .populate("patient", "full_name email")
        .populate("doctor", "user specialty")
        .populate("appointment", "scheduled_at");
    } else {
      prescription = await Prescription.findOne({
        _id: id,
        patient: userId,
      })
        .populate("patient", "full_name email")
        .populate("doctor", "user specialty")
        .populate("appointment", "scheduled_at");
    }

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (error) {
    console.error("Get prescription error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update prescription status
export const updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctorId = req.user._id;

    const prescription = await Prescription.findOneAndUpdate(
      { _id: id, doctor: doctorId },
      { status },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (error) {
    console.error("Update prescription error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all prescriptions created by this doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "full_name email")
      .populate("appointment", "scheduled_at")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error("Get doctor prescriptions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Generate PDF for a prescription
export const generatePrescriptionPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Get prescription with populated data
    let prescription;
    if (userRole === "doctor") {
      prescription = await Prescription.findOne({
        _id: id,
        doctor: userId,
      })
        .populate("patient", "full_name email date_of_birth gender")
        .populate("doctor", "user specialty")
        .populate("appointment", "scheduled_at");
    } else {
      prescription = await Prescription.findOne({
        _id: id,
        patient: userId,
      })
        .populate("patient", "full_name email date_of_birth gender")
        .populate("doctor", "user specialty")
        .populate("appointment", "scheduled_at");
    }

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Populate doctor user data
    await prescription.populate("doctor.user", "full_name");

    // Generate PDF
    const PDFDocument = (await import("pdfkit")).default;
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="prescription-${id.slice(-8)}.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Tenaye Health", 50, 50);
    doc.fontSize(12).text("Remote Patient Health Monitoring System", 50, 75);
    doc.moveDown();

    // Title
    doc.fontSize(18).text("Medical Prescription", 50, 110);
    doc.moveDown();

    // Prescription ID and Date
    doc.fontSize(10).text(`Prescription ID: ${prescription._id}`, 50, 140);
    doc.text(
      `Date: ${new Date(prescription.createdAt).toLocaleDateString()}`,
      50,
      155
    );
    doc.moveDown();

    // Patient Information
    doc.fontSize(14).text("Patient Information", 50, 180);
    doc.fontSize(10);
    doc.text(`Name: ${prescription.patient?.full_name || "N/A"}`, 50, 200);
    doc.text(`Email: ${prescription.patient?.email || "N/A"}`, 50, 215);
    if (prescription.patient?.date_of_birth) {
      doc.text(
        `Date of Birth: ${new Date(
          prescription.patient.date_of_birth
        ).toLocaleDateString()}`,
        50,
        230
      );
    }
    if (prescription.patient?.gender) {
      doc.text(`Gender: ${prescription.patient.gender}`, 50, 245);
    }
    doc.moveDown();

    // Doctor Information
    doc.fontSize(14).text("Prescribing Doctor", 50, 270);
    doc.fontSize(10);
    doc.text(
      `Name: Dr. ${prescription.doctor?.user?.full_name || "N/A"}`,
      50,
      290
    );
    doc.text(
      `Specialty: ${prescription.doctor?.specialty || "General"}`,
      50,
      305
    );
    doc.moveDown();

    // Diagnosis
    if (prescription.diagnosis) {
      doc.fontSize(14).text("Diagnosis", 50, 335);
      doc.fontSize(10).text(prescription.diagnosis, 50, 355);
      doc.moveDown();
    }

    // Medications
    doc.fontSize(14).text("Prescribed Medications", 50, 385);
    doc.moveDown();

    if (prescription.medications && prescription.medications.length > 0) {
      let yPosition = 410;
      prescription.medications.forEach((med, index) => {
        doc.fontSize(11).text(`${index + 1}. ${med.name}`, 50, yPosition);
        yPosition += 15;
        doc.fontSize(10);
        doc.text(`   Dosage: ${med.dosage}`, 50, yPosition);
        yPosition += 15;
        doc.text(`   Duration: ${med.duration}`, 50, yPosition);
        yPosition += 15;
        if (med.frequency) {
          doc.text(`   Frequency: ${med.frequency}`, 50, yPosition);
          yPosition += 15;
        }
        if (med.instructions) {
          doc.text(`   Instructions: ${med.instructions}`, 50, yPosition);
          yPosition += 15;
        }
        yPosition += 10;
      });
    } else {
      doc.fontSize(10).text("No medications prescribed.", 50, 410);
    }

    // Notes
    if (prescription.notes) {
      doc.moveDown();
      doc.fontSize(14).text("Additional Notes", 50, doc.y + 20);
      doc.fontSize(10).text(prescription.notes, 50, doc.y + 15);
    }

    // Footer
    doc.fontSize(8).text(
      "This prescription was generated electronically from Tenaye Health.",
      50,
      750
    );
    doc.text(
      "Please consult with your doctor before taking any medication.",
      50,
      765
    );

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Generate PDF error:", error);
    res.status(500).json({ message: error.message });
  }
};
