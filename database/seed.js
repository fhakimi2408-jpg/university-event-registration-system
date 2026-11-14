const db = require('./db');
console.log('Resetting and seeding database with initial demo data...');
db.resetDefaults();
console.log('Database seeded successfully!');
console.log('Sample Logins:');
console.log('  Student: faiz@siswa.upsi.edu.my | Pass: student123 (or Matric: D20241110929)');
console.log('  Student: firdaus@siswa.upsi.edu.my | Pass: student123 (or Matric: D20241110844)');
console.log('  Admin:   admin@upsi.edu.my | Pass: admin123 (or Staff ID: STAFF001)');
