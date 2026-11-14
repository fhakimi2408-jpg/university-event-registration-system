const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'upsi-des3083-secret-key-group-g2',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    httpOnly: true
  }
}));

// Auth Middlewares
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
  }
  next();
}

function requireStudent(req, res, next) {
  if (!req.session || !req.session.user || req.session.user.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Forbidden. Student account required.' });
  }
  next();
}

// ==========================================
// 1. INCREMENT 1: AUTHENTICATION (FR1)
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { loginKey, password } = req.body;
  if (!loginKey || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials.' });
  }

  const user = db.findUserByEmailOrIdentifier(loginKey.trim());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email/matric or password.' });
  }

  const match = bcrypt.compareSync(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid email/matric or password.' });
  }

  // Create session
  req.session.user = {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    identifier: user.identifier,
    role: user.role,
    faculty: user.faculty
  };

  res.json({
    success: true,
    message: 'Login successful',
    user: req.session.user
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ success: true, user: req.session.user });
  }
  res.status(401).json({ success: false, message: 'Not logged in.' });
});

// ==========================================
// 2. INCREMENT 2: STUDENT REGISTRATIONS (FR2, FR3, FR4)
// ==========================================
// Get active campus events
app.get('/api/events', requireAuth, (req, res) => {
  res.json(db.getAllEvents());
});

// Get current student's registrations
app.get('/api/registrations', requireStudent, (req, res) => {
  const list = db.getStudentRegistrations(req.session.user.user_id);
  res.json(list);
});

// FR2: Create new registration
app.post('/api/registrations', requireStudent, (req, res) => {
  const { event_id, participant_info } = req.body;
  if (!event_id || !participant_info) {
    return res.status(400).json({ success: false, message: 'Please select an event and provide participant details.' });
  }

  const event = db.getEventById(event_id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Selected event not found.' });
  }

  const newReg = db.createRegistration({
    student_id: req.session.user.user_id,
    event_id: Number(event_id),
    participant_info
  });

  res.status(201).json({ success: true, message: 'Registration created.', registration: newReg });
});

// FR4: Update a Pending registration
app.put('/api/registrations/:id', requireStudent, (req, res) => {
  const result = db.updatePendingRegistration(
    req.params.id,
    req.session.user.user_id,
    req.body
  );

  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// FR3: Delete a Pending registration
app.delete('/api/registrations/:id', requireStudent, (req, res) => {
  const result = db.deletePendingRegistration(
    req.params.id,
    req.session.user.user_id
  );

  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// ==========================================
// 3. INCREMENT 3: ADMIN WORKFLOW (FR5)
// ==========================================
// Get all registrations across students
app.get('/api/admin/registrations', requireAdmin, (req, res) => {
  const all = db.getAllRegistrationsForAdmin();
  res.json(all);
});

// FR5: Approve or Reject
app.patch('/api/admin/registrations/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const result = db.reviewRegistration(
    req.params.id,
    req.session.user.user_id,
    status
  );

  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Default Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` University Event Registration System (DES3083 - G2)`);
  console.log(` Staged Delivery Incremental Development`);
  console.log(` Server running at: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
