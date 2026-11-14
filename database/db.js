const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data.json');

// Default initial state
const defaultData = {
  users: [
    {
      user_id: 1,
      full_name: "Muhammad Faiz Husaini",
      email: "faiz@siswa.upsi.edu.my",
      identifier: "D20241110929",
      password_hash: bcrypt.hashSync("student123", 10),
      role: "student",
      faculty: "Faculty of Computing and Meta-Technology",
      phone_number: "011-23456789"
    },
    {
      user_id: 2,
      full_name: "Muhammad Firdaus Hakimi",
      email: "firdaus@siswa.upsi.edu.my",
      identifier: "D20241110844",
      password_hash: bcrypt.hashSync("student123", 10),
      role: "student",
      faculty: "Faculty of Computing and Meta-Technology",
      phone_number: "012-34567890"
    },
    {
      user_id: 3,
      full_name: "Dr. Suliana binti Sulaiman",
      email: "admin@upsi.edu.my",
      identifier: "STAFF001",
      password_hash: bcrypt.hashSync("admin123", 10),
      role: "admin",
      faculty: "Faculty of Computing and Meta-Technology",
      phone_number: "019-87654321"
    }
  ],
  events: [
    {
      event_id: 1,
      event_name: "UPSI Tech Innovation Hackathon 2026",
      description: "Annual university 48-hour programming and software engineering hackathon.",
      event_date: "2026-12-05",
      venue: "Auditorium Bangunan E-Learning, Kampus Sultan Azlan Shah",
      max_participants: 120
    },
    {
      event_id: 2,
      event_name: "AI & Software Process Industry Seminar",
      description: "Keynote presentation with tech industry leaders on Staged Delivery and Agile.",
      event_date: "2026-11-25",
      venue: "Dewan Kuliah Utama 1",
      max_participants: 200
    },
    {
      event_id: 3,
      event_name: "University Sports & E-Sports Carnival",
      description: "Inter-faculty competitions for university students.",
      event_date: "2026-12-12",
      venue: "Kompleks Sukan UPSI",
      max_participants: 300
    }
  ],
  registrations: [
    {
      registration_id: 1,
      student_id: 1,
      event_id: 1,
      participant_info: "Team Leader - Web Dev Track (Dietary: None)",
      status: "Pending",
      submission_date: "2026-11-14T09:30:00.000Z",
      reviewed_at: null,
      reviewed_by: null
    },
    {
      registration_id: 2,
      student_id: 2,
      event_id: 2,
      participant_info: "Interested in Software Quality Assurance seminar session",
      status: "Pending",
      submission_date: "2026-11-14T10:15:00.000Z",
      reviewed_at: null,
      reviewed_by: null
    }
  ]
};

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    saveDb(defaultData);
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, re-initializing:', err);
    saveDb(defaultData);
    return defaultData;
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Database helper operations
const db = {
  findUserByEmailOrIdentifier(loginKey) {
    const data = readDb();
    return data.users.find(u => 
      u.email.toLowerCase() === loginKey.toLowerCase() || 
      u.identifier.toLowerCase() === loginKey.toLowerCase()
    );
  },

  findUserById(id) {
    const data = readDb();
    return data.users.find(u => u.user_id === Number(id));
  },

  getAllEvents() {
    return readDb().events;
  },

  getEventById(id) {
    return readDb().events.find(e => e.event_id === Number(id));
  },

  // FR2: Create event registration
  createRegistration({ student_id, event_id, participant_info }) {
    const data = readDb();
    const nextId = data.registrations.length > 0 
      ? Math.max(...data.registrations.map(r => r.registration_id)) + 1 
      : 1;

    const newReg = {
      registration_id: nextId,
      student_id: Number(student_id),
      event_id: Number(event_id),
      participant_info: participant_info.trim(),
      status: "Pending",
      submission_date: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null
    };

    data.registrations.push(newReg);
    saveDb(data);
    return newReg;
  },

  // Get registrations for a specific student with event details
  getStudentRegistrations(studentId) {
    const data = readDb();
    const studentRegs = data.registrations.filter(r => r.student_id === Number(studentId));
    return studentRegs.map(r => {
      const event = data.events.find(e => e.event_id === r.event_id) || {};
      return {
        ...r,
        event_name: event.event_name,
        event_date: event.event_date,
        venue: event.venue
      };
    });
  },

  // FR4: Update pending registration
  updatePendingRegistration(regId, studentId, { participant_info, event_id }) {
    const data = readDb();
    const reg = data.registrations.find(
      r => r.registration_id === Number(regId) && r.student_id === Number(studentId)
    );

    if (!reg) return { success: false, message: "Registration not found" };
    if (reg.status !== "Pending") return { success: false, message: "Cannot edit non-pending registration" };

    if (participant_info !== undefined) reg.participant_info = participant_info.trim();
    if (event_id !== undefined) reg.event_id = Number(event_id);
    reg.submission_date = new Date().toISOString();

    saveDb(data);
    return { success: true, registration: reg };
  },

  // FR3: Delete pending registration
  deletePendingRegistration(regId, studentId) {
    const data = readDb();
    const index = data.registrations.findIndex(
      r => r.registration_id === Number(regId) && r.student_id === Number(studentId)
    );

    if (index === -1) return { success: false, message: "Registration not found" };
    if (data.registrations[index].status !== "Pending") {
      return { success: false, message: "Only pending registrations can be deleted" };
    }

    data.registrations.splice(index, 1);
    saveDb(data);
    return { success: true };
  },

  // FR5: Admin view all submissions with student and event metadata
  getAllRegistrationsForAdmin() {
    const data = readDb();
    return data.registrations.map(r => {
      const student = data.users.find(u => u.user_id === r.student_id) || {};
      const event = data.events.find(e => e.event_id === r.event_id) || {};
      const admin = data.users.find(u => u.user_id === r.reviewed_by);
      return {
        ...r,
        student_name: student.full_name || 'Unknown',
        student_matric: student.identifier || 'N/A',
        student_faculty: student.faculty || 'N/A',
        event_name: event.event_name || 'N/A',
        event_date: event.event_date || 'N/A',
        reviewed_by_name: admin ? admin.full_name : null
      };
    }).sort((a, b) => b.registration_id - a.registration_id);
  },

  // FR5: Approve or Reject
  reviewRegistration(regId, adminId, newStatus) {
    if (!['Approved', 'Rejected'].includes(newStatus)) {
      return { success: false, message: "Invalid status decision" };
    }
    const data = readDb();
    const reg = data.registrations.find(r => r.registration_id === Number(regId));
    if (!reg) return { success: false, message: "Registration not found" };

    reg.status = newStatus;
    reg.reviewed_at = new Date().toISOString();
    reg.reviewed_by = Number(adminId);

    saveDb(data);
    return { success: true, registration: reg };
  },

  resetDefaults() {
    saveDb(defaultData);
  }
};

// Auto initialize on load if not present
readDb();

module.exports = db;
