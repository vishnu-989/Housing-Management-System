-- ==========================================================================
-- Relational Database Management System (DBMS) Schema - Society.db
-- ==========================================================================

-- 1. USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'admin', 'owner', 'tenant', 'security'
    flat VARCHAR(20),
    avatar VARCHAR(5)
);

-- 2. GATE VISITORS TABLE
CREATE TABLE IF NOT EXISTS visitors (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'Guest', 'Delivery', 'Cab', 'Service'
    flat VARCHAR(20) NOT NULL,
    pin VARCHAR(6) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'Pre-Approved', 'Checked In', 'Checked Out'
    entry_time VARCHAR(50),
    exit_time VARCHAR(50),
    approved_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. MAINTENANCE BILLS TABLE
CREATE TABLE IF NOT EXISTS bills (
    id VARCHAR(30) PRIMARY KEY,
    month VARCHAR(30) NOT NULL,
    flat VARCHAR(20) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    tenant VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'Pending', 'Paid'
    paid_date DATE,
    payment_ref VARCHAR(100)
);

-- 4. COMPLAINTS & HELPDESK TICKETS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    flat VARCHAR(20) NOT NULL,
    raised_by VARCHAR(100) NOT NULL,
    urgency VARCHAR(20) NOT NULL, -- 'Normal', 'High', 'Urgent'
    status VARCHAR(20) NOT NULL, -- 'Open', 'In Progress', 'Resolved'
    date DATE NOT NULL,
    assigned_to VARCHAR(100)
);

-- 5. AMENITY BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS amenities (
    id VARCHAR(20) PRIMARY KEY,
    facility VARCHAR(100) NOT NULL,
    booked_by VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    slot VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL
);

-- 6. SOCIETY NOTICES TABLE
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL
);

-- 7. EMERGENCY SOS PANIC LOGS TABLE
CREATE TABLE IF NOT EXISTS emergency_sos (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    flat VARCHAR(20) NOT NULL,
    note TEXT,
    timestamp VARCHAR(50) NOT NULL
);

-- SEED DATA INITIALIZATION
INSERT INTO users (email, password, name, role, flat, avatar) VALUES
('admin@haven.com', 'admin123', 'Rajesh Kumar (Admin)', 'admin', 'A-101', 'RK'),
('owner@haven.com', 'owner123', 'Ananya Roy (Owner)', 'owner', 'A-402', 'AR'),
('tenant@haven.com', 'tenant123', 'Vikram Mehta (Tenant)', 'tenant', 'B-203', 'VM'),
('security@haven.com', 'sec123', 'Guard Shankar (Security)', 'security', 'Main Gate', 'GS');
