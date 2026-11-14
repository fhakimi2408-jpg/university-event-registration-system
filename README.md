# University Event Registration System
**Course:** DES3083 — Software Engineering Process  
**Group:** G2  
**Process Model:** Staged Delivery (Variant of Incremental Development Model)  
**Lecturer:** Profesor Madya Dr. Suliana binti Sulaiman  

---

## 📌 Project Overview
The **University Event Registration System** is a full-stack web application built to replace legacy manual paper submissions with a digitized, structured workflow for campus event registrations and administrative approvals.

## 🚀 Incremental Staged Architecture & Features

### **Stage 1: Core System & Authentication (FR1)**
- Session-based authentication with bcrypt password hashing.
- Role-based access control distinguishing **Students** and **Administrators**.
- Dedicated student and administrator portal interfaces.

### **Stage 2: Student Registration Management (FR2, FR3, FR4)**
- **FR2:** Students submit new event applications with remarks, dates, and participant info.
- **FR3:** Students can delete their pending registrations.
- **FR4:** Students can modify/update pending registration details before review.

### **Stage 3: Administrative Control & Decision Workflow (FR5)**
- **FR5:** Administrator dashboard displaying all student submissions.
- Filter submissions by `Pending`, `Approved`, or `Rejected`.
- Real-time decision workflow with automatic reviewer tracking.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, Express-Session, Bcrypt.js
- **Database:** JSON Document Store & SQL Migration DDL (`database/schema.sql`)
- **Frontend:** HTML5, CSS3, Bootstrap 5.3, Bootstrap Icons
- **Version Control:** Git & GitHub

---

## 💻 How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
git clone https://github.com/fhakimi2408-jpg/university-event-registration-system.git
cd university-event-registration-system
npm install
```

### 3. Reset / Seed Demo Data (Optional)
```bash
npm run seed
```

### 4. Start the Application
```bash
npm start
```
Open your browser at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Pre-Configured Demo Credentials

| Role | Matric / Staff ID | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student** | `D20241110929` | `faiz@siswa.upsi.edu.my` | `student123` |
| **Student** | `D20241110844` | `firdaus@siswa.upsi.edu.my` | `student123` |
| **Administrator** | `STAFF001` | `admin@upsi.edu.my` | `admin123` |

---

## 👥 Team G2 Members & Responsibilities
1. **Muhammad Faiz Husaini bin Mohd Hasnin** (D20241110929) — *Project Lead*
2. **Muhammad Yunus bin Sahul Hameed** (D20241110834) — *Database Admin*
3. **Muhammad Firdaus Hakimi bin Mohd Roohaizard** (D20241110844) — *Back-end Engineer*
4. **Muhammad Harith Danial bin Mohd Faisal** (D20241110933) — *Frontend Lead*
5. **Anif Haikal Danial bin Nazri** (D20241114384) — *QA Lead*
6. **Ahmad Muqrin bin Baharuddin** (D20241110932) — *DevOps Specialist*
