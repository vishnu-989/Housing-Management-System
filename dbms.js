/* ==========================================================================
   Housing Society Management System - Relational DBMS Engine
   Executes Relational Table Queries, SQL Schema setup & persistent storage
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'society.db.json');

class SocietyDBMS {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_PATH)) {
      this.seed();
    }
  }

  seed() {
    const initialTables = {
      usersList: [
        { id: 1, email: 'admin@haven.com', password: 'admin123', name: 'Rajesh Kumar (Admin)', role: 'admin', flat: 'A-101', avatar: 'RK' },
        { id: 2, email: 'owner@haven.com', password: 'owner123', name: 'Ananya Roy (Owner)', role: 'owner', flat: 'A-402', avatar: 'AR' },
        { id: 3, email: 'tenant@haven.com', password: 'tenant123', name: 'Vikram Mehta (Tenant)', role: 'tenant', flat: 'B-203', avatar: 'VM' },
        { id: 4, email: 'security@haven.com', password: 'sec123', name: 'Guard Shankar (Security)', role: 'security', flat: 'Main Gate', avatar: 'GS' }
      ],

      visitors: [
        { id: 'VIS-101', name: 'Rohan Sharma', phone: '+91 98765 11111', type: 'Guest', flat: 'A-402', pin: '492810', status: 'Checked In', entryTime: '10:30 AM', exitTime: '--', approvedBy: 'Ananya Roy (Owner)' },
        { id: 'VIS-102', name: 'Swiggy Delivery (Amit)', phone: '+91 98765 22222', type: 'Delivery', flat: 'B-203', pin: '883192', status: 'Checked Out', entryTime: '11:15 AM', exitTime: '11:28 AM', approvedBy: 'Vikram Mehta' },
        { id: 'VIS-103', name: 'Zomato - Suresh', phone: '+91 98765 33333', type: 'Delivery', flat: 'C-104', pin: '192044', status: 'Pre-Approved', entryTime: 'Expected 08:30 PM', exitTime: '--', approvedBy: 'Pre-approved' },
        { id: 'VIS-104', name: 'Sunita (House Maid)', phone: '+91 98765 44444', type: 'Service', flat: 'A-402', pin: '102938', status: 'Checked In', entryTime: '08:00 AM', exitTime: '--', approvedBy: 'Staff Pass' }
      ],

      bills: [
        { id: 'INV-2026-07', month: 'July 2026', flat: 'A-402', owner: 'Ananya Roy', amount: 4500, dueDate: '2026-08-05', status: 'Pending', breakdown: { maintenance: 3500, water: 500, clubhouse: 500 } },
        { id: 'INV-2026-06', month: 'June 2026', flat: 'A-402', owner: 'Ananya Roy', amount: 4500, dueDate: '2026-07-05', status: 'Paid', paidDate: '2026-07-02', paymentRef: 'UPI-9827104928', breakdown: { maintenance: 3500, water: 500, clubhouse: 500 } },
        { id: 'INV-2026-07-B', month: 'July 2026', flat: 'B-203', owner: 'Sanjay Verma', tenant: 'Vikram Mehta', amount: 4800, dueDate: '2026-08-05', status: 'Paid', paidDate: '2026-07-28', paymentRef: 'UPI-1102938472', breakdown: { maintenance: 3800, water: 500, clubhouse: 500 } },
        { id: 'INV-2026-07-C', month: 'July 2026', flat: 'C-104', owner: 'Priya Nair', amount: 4200, dueDate: '2026-08-05', status: 'Pending', breakdown: { maintenance: 3200, water: 500, clubhouse: 500 } }
      ],

      complaints: [
        { id: 'TKT-881', title: 'Water Leakage in Main Washroom', category: 'Plumbing', flat: 'A-402', raisedBy: 'Ananya Roy', urgency: 'High', status: 'In Progress', date: '2026-07-30', assignedTo: 'Plumber Ramesh' },
        { id: 'TKT-882', title: 'Corridor Light Bulb Flicker', category: 'Electrical', flat: 'B-203', raisedBy: 'Vikram Mehta', urgency: 'Normal', status: 'Open', date: '2026-07-31', assignedTo: 'Unassigned' },
        { id: 'TKT-880', title: 'Lift B Button Unresponsive', category: 'Elevator', flat: 'Block B', raisedBy: 'Rakesh Guard', urgency: 'Urgent', status: 'Resolved', date: '2026-07-29', assignedTo: 'OTIS Service Team' }
      ],

      amenities: [
        { id: 'BK-301', facility: 'Clubhouse Hall', bookedBy: 'Ananya Roy (A-402)', date: '2026-08-10', slot: '06:00 - 08:00 PM', status: 'Confirmed' },
        { id: 'BK-302', facility: 'Tennis Court', bookedBy: 'Vikram Mehta (B-203)', date: '2026-08-01', slot: '07:00 - 08:00 AM', status: 'Confirmed' }
      ],

      notices: [
        { id: 'NTC-01', title: 'Annual Independence Day Celebration Planning', category: 'Event', date: '2026-07-28', author: 'Management Committee', content: 'Join us at the Central Lawn on Aug 15th at 8:30 AM for Flag Hoisting, cultural programs, and high tea. All residents are invited.' },
        { id: 'NTC-02', title: 'Scheduled Underground Tank Cleaning', category: 'Maintenance', date: '2026-07-25', author: 'Estate Manager', content: 'Water supply will be temporarily paused on Aug 3rd from 10:00 AM to 02:00 PM due to annual tank sanitization.' },
        { id: 'NTC-03', title: 'New Visitor PIN Gate Protocol Mandatory', category: 'Urgent', date: '2026-07-20', author: 'Security Team', content: 'Please pre-approve your guests using the HavenOS App. Guests without a valid 6-digit PIN will be verified via intercom call.' }
      ],

      emergencyLogs: []
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initialTables, null, 2), 'utf8');
  }

  // SELECT * FROM table
  queryAll(tableName) {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    return data[tableName] || [];
  }

  // INSERT INTO table
  insert(tableName, row) {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (!data[tableName]) data[tableName] = [];
    data[tableName].unshift(row);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return row;
  }

  // UPDATE table SET ... WHERE id = ...
  updateWhere(tableName, conditionFn, updateFn) {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const rows = data[tableName] || [];
    let updatedRow = null;
    rows.forEach(r => {
      if (conditionFn(r)) {
        updateFn(r);
        updatedRow = r;
      }
    });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return updatedRow;
  }

  // FULL STATE DUMP
  getFullState() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }
}

module.exports = new SocietyDBMS();
