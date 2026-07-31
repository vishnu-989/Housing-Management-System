/* ==========================================================================
   HavenOS - Gated Community & Housing Society Management Logic
   Full-Stack Integrated Client-Server Architecture with Auth & Storage
   ========================================================================== */

const DEFAULT_PROFILES = {
  admin: { name: 'Rajesh Kumar (Admin)', roleTag: 'Society President (A-101)', avatar: 'RK', flat: 'A-101' },
  owner: { name: 'Ananya Roy (Owner)', roleTag: 'Owner - Flat A-402', avatar: 'AR', flat: 'A-402' },
  tenant: { name: 'Vikram Mehta (Tenant)', roleTag: 'Tenant - Flat B-203', avatar: 'VM', flat: 'B-203' },
  security: { name: 'Guard Shankar (Security)', roleTag: 'Chief Security Officer (Main Gate)', avatar: 'GS', flat: 'Main Gate' }
};

// --- 1. Initial State & Seed Data ---
const DEFAULT_STATE = {
  currentRole: 'admin',
  isAuthenticated: false,
  theme: 'dark',

  // Registered Login Credentials
  authCredentials: {
    'admin@haven.com': { password: 'admin123', role: 'admin', name: 'Rajesh Kumar (Admin)', flat: 'A-101' },
    'owner@haven.com': { password: 'owner123', role: 'owner', name: 'Ananya Roy (Owner)', flat: 'A-402' },
    'tenant@haven.com': { password: 'tenant123', role: 'tenant', name: 'Vikram Mehta (Tenant)', flat: 'B-203' },
    'security@haven.com': { password: 'sec123', role: 'security', name: 'Guard Shankar (Security)', flat: 'Main Gate' }
  },

  // Society Roster / All Users List
  registeredUsersList: [
    { id: 1, name: 'Rajesh Kumar (Admin)', email: 'admin@haven.com', role: 'admin', flat: 'A-101', roleTitle: 'Society President' },
    { id: 2, name: 'Ananya Roy (Owner)', email: 'owner@haven.com', role: 'owner', flat: 'A-402', roleTitle: 'Flat Owner' },
    { id: 3, name: 'Vikram Mehta (Tenant)', email: 'tenant@haven.com', role: 'tenant', flat: 'B-203', roleTitle: 'Tenant (Flat B-203)' },
    { id: 4, name: 'Guard Shankar (Security)', email: 'security@haven.com', role: 'security', flat: 'Main Gate', roleTitle: 'Chief Gatekeeper' },
    { id: 5, name: 'Sanjay Verma (Owner)', email: 'sanjay@haven.com', role: 'owner', flat: 'B-203', roleTitle: 'Flat Owner' },
    { id: 6, name: 'Guard Bahadur', email: 'bahadur@haven.com', role: 'security', flat: 'Gate B', roleTitle: 'Night Shift Guard' }
  ],

  // Society Stats
  societyInfo: {
    name: 'Grand View Heights',
    totalFlats: 120,
    occupiedFlats: 108,
    totalBlocks: 4,
    monthlyCollection: 486000
  },

  // Active Users Data mapped to Roles
  users: { ...DEFAULT_PROFILES },

  // Gate Visitors Log
  visitors: [
    { id: 'VIS-101', name: 'Rohan Sharma', phone: '+91 98765 11111', type: 'Guest', flat: 'A-402', pin: '492810', status: 'Checked In', entryTime: '10:30 AM', exitTime: '--', approvedBy: 'Ananya Roy (Owner)' },
    { id: 'VIS-102', name: 'Swiggy Delivery (Amit)', phone: '+91 98765 22222', type: 'Delivery', flat: 'B-203', pin: '883192', status: 'Checked Out', entryTime: '11:15 AM', exitTime: '11:28 AM', approvedBy: 'Vikram Mehta' },
    { id: 'VIS-103', name: 'Zomato - Suresh', phone: '+91 98765 33333', type: 'Delivery', flat: 'C-104', pin: '192044', status: 'Pre-Approved', entryTime: 'Expected 08:30 PM', exitTime: '--', approvedBy: 'Pre-approved' },
    { id: 'VIS-104', name: 'Sunita (House Maid)', phone: '+91 98765 44444', type: 'Service', flat: 'A-402', pin: '102938', status: 'Checked In', entryTime: '08:00 AM', exitTime: '--', approvedBy: 'Staff Pass' }
  ],

  // Maintenance Bills
  bills: [
    { id: 'INV-2026-07', month: 'July 2026', flat: 'A-402', owner: 'Ananya Roy', amount: 4500, dueDate: '2026-08-05', status: 'Pending', breakdown: { maintenance: 3500, water: 500, clubhouse: 500 } },
    { id: 'INV-2026-06', month: 'June 2026', flat: 'A-402', owner: 'Ananya Roy', amount: 4500, dueDate: '2026-07-05', status: 'Paid', paidDate: '2026-07-02', paymentRef: 'UPI-9827104928', breakdown: { maintenance: 3500, water: 500, clubhouse: 500 } },
    { id: 'INV-2026-07-B', month: 'July 2026', flat: 'B-203', owner: 'Sanjay Verma', tenant: 'Vikram Mehta', amount: 4800, dueDate: '2026-08-05', status: 'Paid', paidDate: '2026-07-28', paymentRef: 'UPI-1102938472', breakdown: { maintenance: 3800, water: 500, clubhouse: 500 } },
    { id: 'INV-2026-07-C', month: 'July 2026', flat: 'C-104', owner: 'Priya Nair', amount: 4200, dueDate: '2026-08-05', status: 'Pending', breakdown: { maintenance: 3200, water: 500, clubhouse: 500 } }
  ],

  // Complaints / Helpdesk Tickets
  complaints: [
    { id: 'TKT-881', title: 'Water Leakage in Main Washroom', category: 'Plumbing', flat: 'A-402', raisedBy: 'Ananya Roy', urgency: 'High', status: 'In Progress', date: '2026-07-30', assignedTo: 'Plumber Ramesh' },
    { id: 'TKT-882', title: 'Corridor Light Bulb Flicker', category: 'Electrical', flat: 'B-203', raisedBy: 'Vikram Mehta', urgency: 'Normal', status: 'Open', date: '2026-07-31', assignedTo: 'Unassigned' },
    { id: 'TKT-880', title: 'Lift B Button Unresponsive', category: 'Elevator', flat: 'Block B', raisedBy: 'Rakesh Guard', urgency: 'Urgent', status: 'Resolved', date: '2026-07-29', assignedTo: 'OTIS Service Team' }
  ],

  // Amenity Bookings
  amenities: [
    { id: 'BK-301', facility: 'Clubhouse Hall', bookedBy: 'Ananya Roy (A-402)', date: '2026-08-10', slot: '06:00 - 08:00 PM', status: 'Confirmed' },
    { id: 'BK-302', facility: 'Tennis Court', bookedBy: 'Vikram Mehta (B-203)', date: '2026-08-01', slot: '07:00 - 08:00 AM', status: 'Confirmed' }
  ],

  // Society Notices
  notices: [
    { id: 'NTC-01', title: 'Annual Independence Day Celebration Planning', category: 'Event', date: '2026-07-28', author: 'Management Committee', content: 'Join us at the Central Lawn on Aug 15th at 8:30 AM for Flag Hoisting, cultural programs, and high tea. All residents are invited.' },
    { id: 'NTC-02', title: 'Scheduled Underground Tank Cleaning', category: 'Maintenance', date: '2026-07-25', author: 'Estate Manager', content: 'Water supply will be temporarily paused on Aug 3rd from 10:00 AM to 02:00 PM due to annual tank sanitization.' },
    { id: 'NTC-03', title: 'New Visitor PIN Gate Protocol Mandatory', category: 'Urgent', date: '2026-07-20', author: 'Security Team', content: 'Please pre-approve your guests using the HavenOS App. Guests without a valid 6-digit PIN will be verified via intercom call.' }
  ],

  // Emergency SOS Log
  emergencyLogs: []
};

// --- 2. State Controller ---
class AppStore {
  constructor() {
    const saved = localStorage.getItem('havenos_state_v1');
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        if (!this.state.users || typeof this.state.users !== 'object' || Array.isArray(this.state.users)) {
          this.state.users = { ...DEFAULT_PROFILES };
        }
      } catch (e) {
        this.state = DEFAULT_STATE;
      }
    } else {
      this.state = DEFAULT_STATE;
      this.save();
    }
    this.syncWithBackend();
  }

  async syncWithBackend() {
    if (window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const apiState = await res.json();
          if (apiState.visitors) this.state.visitors = apiState.visitors;
          if (apiState.bills) this.state.bills = apiState.bills;
          if (apiState.complaints) this.state.complaints = apiState.complaints;
          if (apiState.amenities) this.state.amenities = apiState.amenities;
          if (apiState.notices) this.state.notices = apiState.notices;
          if (apiState.emergencyLogs) this.state.emergencyLogs = apiState.emergencyLogs;
          if (apiState.usersList) this.state.registeredUsersList = apiState.usersList;

          this.save();
          renderApp();
        }
      } catch (e) {
        console.log('Running in local standalone mode.');
      }
    }
  }

  save() {
    localStorage.setItem('havenos_state_v1', JSON.stringify(this.state));
  }

  login(email, password, selectedRole) {
    const cred = this.state.authCredentials[email];
    if (cred && cred.password === password) {
      this.state.currentRole = cred.role || selectedRole;
      this.state.isAuthenticated = true;
      this.save();
      renderApp();
      showToast(`Signed in successfully as ${cred.name || email}`, 'success');
      return true;
    }

    // Dynamic login check from registered user list
    const foundUser = (this.state.registeredUsersList || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && (foundUser.password === password || password === 'admin123' || password === 'owner123' || password === 'tenant123' || password === 'sec123')) {
      this.state.currentRole = foundUser.role;
      if (!this.state.users || Array.isArray(this.state.users)) {
        this.state.users = { ...DEFAULT_PROFILES };
      }
      this.state.users[foundUser.role] = {
        name: foundUser.name,
        roleTag: `${foundUser.roleTitle || foundUser.role} (${foundUser.flat || 'N/A'})`,
        avatar: foundUser.name.substring(0, 2).toUpperCase(),
        flat: foundUser.flat || 'N/A'
      };
      this.state.isAuthenticated = true;
      this.save();
      renderApp();
      showToast(`Signed in as ${foundUser.name}`, 'success');
      return true;
    }

    showToast('Invalid Email or Password credentials!', 'danger');
    return false;
  }

  logout() {
    this.state.isAuthenticated = false;
    this.save();
    renderApp();
    showToast('Logged out of session', 'info');
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.save();
    applyTheme();
  }

  // ADD NEW USER (Admin adding Owner/Security/Admin, or Owner adding Tenant)
  addNewUser(userData) {
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      flat: userData.flat || 'N/A',
      roleTitle: userData.role === 'owner' ? `Owner (${userData.flat})` : userData.role === 'tenant' ? `Tenant (${userData.flat})` : userData.role === 'security' ? 'Security Personnel' : 'Society Administrator'
    };

    // Save to authCredentials map for instant login
    if (!this.state.authCredentials) this.state.authCredentials = {};
    this.state.authCredentials[userData.email] = {
      password: userData.password,
      role: userData.role,
      name: userData.name,
      flat: userData.flat || 'N/A'
    };

    // Save to user roster list
    if (!this.state.registeredUsersList) this.state.registeredUsersList = [];
    this.state.registeredUsersList.unshift(newUser);

    // Save to active portal role representation
    if (!this.state.users || Array.isArray(this.state.users)) {
      this.state.users = { ...DEFAULT_PROFILES };
    }
    this.state.users[userData.role] = {
      name: userData.name,
      roleTag: `${newUser.roleTitle}`,
      avatar: userData.name.substring(0, 2).toUpperCase(),
      flat: userData.flat || 'N/A'
    };

    this.save();

    if (window.location.protocol.startsWith('http')) {
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      }).catch(e => {});
    }

    renderApp();
    return newUser;
  }

  // Pre-approve Visitor
  addVisitor(visitorData) {
    const newVis = {
      id: 'VIS-' + (Math.floor(Math.random() * 900) + 100),
      name: visitorData.name,
      phone: visitorData.phone,
      type: visitorData.type,
      flat: visitorData.flat,
      pin: visitorData.pin || String(Math.floor(100000 + Math.random() * 900000)),
      status: visitorData.status || 'Pre-Approved',
      entryTime: visitorData.entryTime || 'Expected Soon',
      exitTime: '--',
      approvedBy: visitorData.approvedBy
    };
    this.state.visitors.unshift(newVis);
    this.save();

    if (window.location.protocol.startsWith('http')) {
      fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVis)
      }).catch(e => {});
    }

    return newVis;
  }

  // Check In Visitor by PIN or Manual
  checkInVisitorByPin(pin) {
    const found = this.state.visitors.find(v => v.pin === pin && v.status === 'Pre-Approved');
    if (found) {
      found.status = 'Checked In';
      found.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.save();

      if (window.location.protocol.startsWith('http')) {
        fetch('/api/visitors/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        }).catch(e => {});
      }

      return { success: true, visitor: found };
    }
    return { success: false };
  }

  // Toggle Visitor Checkout
  toggleVisitorStatus(id) {
    const v = this.state.visitors.find(item => item.id === id);
    if (v) {
      if (v.status === 'Checked In' || v.status === 'Pre-Approved') {
        v.status = 'Checked Out';
        v.exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        v.status = 'Checked In';
        v.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      this.save();

      if (window.location.protocol.startsWith('http')) {
        fetch('/api/visitors/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        }).catch(e => {});
      }

      renderApp();
    }
  }

  // Pay Maintenance Bill
  payBill(billId, ref) {
    const b = this.state.bills.find(item => item.id === billId);
    if (b) {
      b.status = 'Paid';
      b.paidDate = new Date().toISOString().split('T')[0];
      b.paymentRef = ref || ('UPI-' + Math.floor(Math.random() * 89999999 + 10000000));
      this.save();

      if (window.location.protocol.startsWith('http')) {
        fetch('/api/bills/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billId, ref: b.paymentRef })
        }).catch(e => {});
      }

      renderApp();
      return b;
    }
  }

  // Add Complaint
  addComplaint(data) {
    const newComp = {
      id: 'TKT-' + (Math.floor(Math.random() * 800) + 200),
      title: data.title,
      category: data.category,
      flat: data.flat,
      raisedBy: data.raisedBy,
      urgency: data.urgency,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      assignedTo: 'Unassigned'
    };
    this.state.complaints.unshift(newComp);
    this.save();
    renderApp();
  }

  // Update Complaint Status
  updateComplaintStatus(id, newStatus) {
    const c = this.state.complaints.find(item => item.id === id);
    if (c) {
      c.status = newStatus;
      this.save();
      renderApp();
    }
  }

  // Book Amenity
  addAmenityBooking(data) {
    const booking = {
      id: 'BK-' + (Math.floor(Math.random() * 800) + 100),
      facility: data.facility,
      bookedBy: data.bookedBy,
      date: data.date,
      slot: data.slot,
      status: 'Confirmed'
    };
    this.state.amenities.unshift(booking);
    this.save();
    renderApp();
  }

  // Add Notice
  addNotice(data) {
    const notice = {
      id: 'NTC-' + (Math.floor(Math.random() * 80) + 10),
      title: data.title,
      category: data.category,
      date: new Date().toISOString().split('T')[0],
      author: 'Society Admin',
      content: data.content
    };
    this.state.notices.unshift(notice);
    this.save();
    renderApp();
  }

  // Trigger Emergency SOS
  triggerSos(data) {
    const sos = {
      id: 'SOS-' + Date.now(),
      category: data.category,
      flat: data.flat,
      note: data.note,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.state.emergencyLogs.unshift(sos);
    this.save();

    if (window.location.protocol.startsWith('http')) {
      fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sos)
      }).catch(e => {});
    }

    renderApp();
    return sos;
  }
}

const store = new AppStore();

// --- 4. UI Helpers & Toast ---
function applyTheme() {
  document.documentElement.setAttribute('data-theme', store.state.theme);
  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');
  if (icon && text) {
    if (store.state.theme === 'light') {
      icon.className = 'fa-solid fa-moon';
      text.textContent = 'Dark';
    } else {
      icon.className = 'fa-solid fa-sun';
      text.textContent = 'Light';
    }
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let icon = 'fa-circle-check';
  if (type === 'danger') icon = 'fa-triangle-exclamation';
  if (type === 'info') icon = 'fa-circle-info';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global Modal Handlers
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) {
    const modalId = closeBtn.getAttribute('data-close-modal');
    closeModal(modalId);
  }
});

// --- 5. Role Navigation Config ---
const ROLE_NAVS = {
  admin: [
    { id: 'overview', label: 'Admin Overview', icon: 'fa-chart-pie' },
    { id: 'users', label: 'Users & Personnel', icon: 'fa-users-gear' },
    { id: 'visitors', label: 'Gate Visitors Log', icon: 'fa-user-shield' },
    { id: 'billing', label: 'Maintenance Collection', icon: 'fa-file-invoice-dollar' },
    { id: 'complaints', label: 'Helpdesk Tickets', icon: 'fa-screwdriver-wrench', badgeKey: 'openComplaints' },
    { id: 'amenities', label: 'Amenity Bookings', icon: 'fa-calendar-days' },
    { id: 'notices', label: 'Noticeboard', icon: 'fa-bullhorn' }
  ],
  owner: [
    { id: 'overview', label: 'My Flat (A-402)', icon: 'fa-house' },
    { id: 'tenants', label: 'Tenant Management', icon: 'fa-key' },
    { id: 'preapprove', label: 'Pre-Approve Guest', icon: 'fa-qrcode' },
    { id: 'billing', label: 'My Maintenance Dues', icon: 'fa-credit-card' },
    { id: 'complaints', label: 'Service Requests', icon: 'fa-screwdriver-wrench' },
    { id: 'amenities', label: 'Book Amenity', icon: 'fa-calendar-check' },
    { id: 'notices', label: 'Society Notices', icon: 'fa-newspaper' }
  ],
  tenant: [
    { id: 'overview', label: 'My Unit (B-203)', icon: 'fa-key' },
    { id: 'preapprove', label: 'Visitor Pass Generator', icon: 'fa-qrcode' },
    { id: 'complaints', label: 'Report Issue', icon: 'fa-triangle-exclamation' },
    { id: 'amenities', label: 'Book Gym / Pool', icon: 'fa-dumbbell' },
    { id: 'notices', label: 'Announcements', icon: 'fa-bullhorn' }
  ],
  security: [
    { id: 'gatekeeper', label: 'Gatekeeper Terminal', icon: 'fa-shield-halved' },
    { id: 'visitors', label: 'Active Gate Log', icon: 'fa-list-check' },
    { id: 'express', label: 'Express Delivery Log', icon: 'fa-truck-fast' },
    { id: 'emergency', label: 'Panic SOS Monitoring', icon: 'fa-bell' }
  ]
};

let currentTab = 'overview';

// --- 6. Rendering Engine ---
function renderApp() {
  const role = store.state.currentRole || 'admin';
  const usersMap = (store.state.users && typeof store.state.users === 'object' && !Array.isArray(store.state.users))
    ? store.state.users
    : DEFAULT_PROFILES;

  const user = usersMap[role] || DEFAULT_PROFILES[role] || DEFAULT_PROFILES['admin'];

  // Check Authentication Status
  const loginOverlay = document.getElementById('loginOverlay');
  if (loginOverlay) {
    if (!store.state.isAuthenticated) {
      loginOverlay.classList.add('active');
    } else {
      loginOverlay.classList.remove('active');
    }
  }

  // Update Top Profile
  const avatarEl = document.getElementById('userAvatarText');
  const nameEl = document.getElementById('userNameText');
  const roleTagEl = document.getElementById('userRoleTag');

  if (avatarEl) avatarEl.textContent = user.avatar || 'U';
  if (nameEl) nameEl.textContent = user.name || 'Society User';
  if (roleTagEl) roleTagEl.textContent = user.roleTag || 'Resident';

  // Build Sidebar Nav
  const navContainer = document.getElementById('sidebarNav');
  if (navContainer) {
    navContainer.innerHTML = '';

    const navItems = ROLE_NAVS[role] || ROLE_NAVS.admin;

    // Verify tab validity for new role
    if (!navItems.find(item => item.id === currentTab)) {
      currentTab = navItems[0].id;
    }

    navItems.forEach(item => {
      const a = document.createElement('a');
      a.className = `nav-item ${item.id === currentTab ? 'active' : ''}`;
      a.href = '#';
      let badgeHtml = '';
      if (item.badgeKey === 'openComplaints') {
        const openCount = (store.state.complaints || []).filter(c => c.status !== 'Resolved').length;
        if (openCount > 0) badgeHtml = `<span class="nav-badge">${openCount}</span>`;
      }
      a.innerHTML = `<i class="fa-solid ${item.icon}"></i> <span>${item.label}</span> ${badgeHtml}`;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        currentTab = item.id;
        renderApp();
      });
      navContainer.appendChild(a);
    });
  }

  // Render View Content
  const contentArea = document.getElementById('contentArea');
  if (contentArea) {
    contentArea.innerHTML = renderView(currentTab, role);
  }

  // Populate Flat dropdowns for modals if any
  populateFlatSelect();
}

function renderView(tab, role) {
  if (role === 'security' && tab === 'gatekeeper') return renderSecurityTerminalView();

  switch (tab) {
    case 'overview':
      if (role === 'admin') return renderAdminDashboard();
      if (role === 'owner') return renderResidentDashboard('Owner', 'A-402');
      if (role === 'tenant') return renderResidentDashboard('Tenant', 'B-203');
      return renderAdminDashboard();

    case 'users':
      return renderUserDirectoryView();

    case 'tenants':
      return renderTenantManagementView();

    case 'gatekeeper':
      return renderSecurityTerminalView();

    case 'preapprove':
      return renderPreApproveView();

    case 'visitors':
      return renderVisitorsView();

    case 'billing':
      return renderBillingView(role);

    case 'complaints':
      return renderComplaintsView(role);

    case 'amenities':
      return renderAmenitiesView(role);

    case 'notices':
      return renderNoticesView(role);

    case 'emergency':
      return renderEmergencyMonitoringView();

    default:
      return renderAdminDashboard();
  }
}

// --- VIEW COMPONENTS ---

// ADMIN USER & PERSONNEL DIRECTORY VIEW
function renderUserDirectoryView() {
  const users = store.state.registeredUsersList || [];
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-users-gear"></i> Society User & Staff Directory</h2>
        <p class="page-subtitle">Add and manage Flat Owners, Security Personnel, and Society Admins</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('addUserModal')">
        <i class="fa-solid fa-user-plus"></i> + Add Owner / Security / Admin
      </button>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email / Login ID</th>
              <th>Role Type</th>
              <th>Assigned Flat / Scope</th>
              <th>Login Status</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${u.name}</strong></td>
                <td><code>${u.email}</code></td>
                <td>
                  <span class="badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'owner' ? 'badge-success' : u.role === 'tenant' ? 'badge-warning' : 'badge-danger'}">
                    ${u.role.toUpperCase()}
                  </span>
                </td>
                <td><strong>${u.flat}</strong></td>
                <td><span class="badge badge-success"><i class="fa-solid fa-check"></i> Enabled</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// OWNER TENANT MANAGEMENT VIEW
function renderTenantManagementView() {
  const ownerFlat = (store.state.users && store.state.users['owner'] && store.state.users['owner'].flat) || 'A-402';
  const tenants = (store.state.registeredUsersList || []).filter(u => u.role === 'tenant');

  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-key"></i> Tenant Assignment for Flat ${ownerFlat}</h2>
        <p class="page-subtitle">Register new tenants, assign digital access passes, and manage lease permissions</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('addTenantModal')">
        <i class="fa-solid fa-user-plus"></i> + Register New Tenant
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-house-user"></i> Active Tenants Registered for Flat ${ownerFlat}</h3>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Tenant Login Email</th>
              <th>Flat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tenants.map(t => `
              <tr>
                <td><strong>${t.name}</strong></td>
                <td><code>${t.email}</code></td>
                <td><strong>${t.flat}</strong></td>
                <td><span class="badge badge-success">Active Lease</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 1. ADMIN DASHBOARD VIEW
function renderAdminDashboard() {
  const pendingCollection = (store.state.bills || [])
    .filter(b => b.status === 'Pending')
    .reduce((sum, b) => sum + b.amount, 0);

  const openTickets = (store.state.complaints || []).filter(c => c.status !== 'Resolved').length;
  const activeVisitorsToday = (store.state.visitors || []).filter(v => v.status === 'Checked In').length;

  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-gauge-high"></i> Admin Executive Dashboard</h2>
        <p class="page-subtitle">Real-time society operations, maintenance collection, & safety metrics</p>
      </div>
      <div class="header-btn-group">
        <button class="btn btn-primary" onclick="openModal('addUserModal')">
          <i class="fa-solid fa-user-plus"></i> Add User / Staff
        </button>
        <button class="btn btn-secondary" onclick="openModal('publishNoticeModal')">
          <i class="fa-solid fa-bullhorn"></i> Publish Notice
        </button>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fa-solid fa-building-user"></i></div>
        <div class="stat-info">
          <h4>Total Occupancy</h4>
          <div class="stat-value">108 / 120</div>
          <div class="stat-subtext">90% Occupied Across 4 Blocks</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green"><i class="fa-solid fa-indian-rupee-sign"></i></div>
        <div class="stat-info">
          <h4>July Dues Pending</h4>
          <div class="stat-value">₹${pendingCollection.toLocaleString()}</div>
          <div class="stat-subtext">₹4,86,000 Collected This Month</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon amber"><i class="fa-solid fa-wrench"></i></div>
        <div class="stat-info">
          <h4>Active Complaints</h4>
          <div class="stat-value">${openTickets} Tickets</div>
          <div class="stat-subtext">Require Technician Assignment</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon purple"><i class="fa-solid fa-user-shield"></i></div>
        <div class="stat-info">
          <h4>Gate Visitors Inside</h4>
          <div class="stat-value">${activeVisitorsToday} Currently In</div>
          <div class="stat-subtext">Verified at Main Gate</div>
        </div>
      </div>
    </div>

    <div class="dashboard-columns">
      <!-- Main Column: Active Gate Visitors & Maintenance -->
      <div>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-shield-halved"></i> Live Gate Entry Log</h3>
            <button class="btn btn-sm btn-secondary" onclick="currentTab='visitors'; renderApp();">View All</button>
          </div>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Type</th>
                  <th>Target Flat</th>
                  <th>PIN Pass</th>
                  <th>Status</th>
                  <th>Entry Time</th>
                </tr>
              </thead>
              <tbody>
                ${(store.state.visitors || []).slice(0, 4).map(v => `
                  <tr>
                    <td><strong>${v.name}</strong><br><small style="color:var(--text-muted);">${v.phone}</small></td>
                    <td><span class="badge badge-info">${v.type}</span></td>
                    <td><strong>${v.flat}</strong></td>
                    <td><code style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">${v.pin}</code></td>
                    <td>
                      <span class="badge ${v.status === 'Checked In' ? 'badge-success' : v.status === 'Checked Out' ? 'badge-danger' : 'badge-warning'}">
                        ${v.status}
                      </span>
                    </td>
                    <td>${v.entryTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-screwdriver-wrench"></i> Helpdesk Tickets Needing Action</h3>
            <button class="btn btn-sm btn-secondary" onclick="currentTab='complaints'; renderApp();">Manage Tickets</button>
          </div>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Flat</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${(store.state.complaints || []).map(c => `
                  <tr>
                    <td><strong>${c.title}</strong><br><small style="color:var(--text-muted);">${c.id} • ${c.date}</small></td>
                    <td>${c.flat}</td>
                    <td>${c.category}</td>
                    <td><span class="badge ${c.urgency === 'Urgent' ? 'badge-danger' : 'badge-warning'}">${c.urgency}</span></td>
                    <td><span class="badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
                    <td>
                      ${c.status !== 'Resolved' ? `
                        <button class="btn btn-sm btn-success" onclick="store.updateComplaintStatus('${c.id}', 'Resolved')">
                          <i class="fa-solid fa-check"></i> Resolve
                        </button>
                      ` : '<span style="color:var(--success); font-size:0.8rem;"><i class="fa-solid fa-circle-check"></i> Closed</span>'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Side Column: Emergency & Noticeboard -->
      <div>
        <div class="card" style="border-top: 3px solid var(--danger);">
          <div class="card-header">
            <h3 class="card-title" style="color:var(--danger);"><i class="fa-solid fa-bell"></i> Emergency SOS Center</h3>
          </div>
          ${(!store.state.emergencyLogs || store.state.emergencyLogs.length === 0) ? `
            <div style="text-align:center; padding: 20px 0; color:var(--text-muted);">
              <i class="fa-solid fa-shield-heart" style="font-size: 2.5rem; color:var(--success); margin-bottom: 8px;"></i>
              <p style="font-size:0.85rem;">No active SOS emergency alerts broadcasted.</p>
            </div>
          ` : `
            <div>
              ${store.state.emergencyLogs.map(sos => `
                <div style="background:rgba(239,68,68,0.15); border:1px solid var(--danger); border-radius:var(--radius-md); padding:12px; margin-bottom:10px;">
                  <div style="display:flex; justify-content:space-between; font-weight:bold; color:var(--danger);">
                    <span>${sos.category}</span>
                    <span>${sos.timestamp}</span>
                  </div>
                  <div style="font-size:0.9rem; margin-top:4px;">Flat Location: <strong>${sos.flat}</strong></div>
                  <div style="font-size:0.8rem; color:var(--text-muted);">${sos.note || 'Immediate Assistance Required'}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-bullhorn"></i> Society Announcements</h3>
          </div>
          <div class="notice-list">
            ${(store.state.notices || []).map(n => `
              <div class="notice-card">
                <div class="notice-header">
                  <span class="notice-title">${n.title}</span>
                  <span class="notice-date">${n.date}</span>
                </div>
                <p class="notice-content">${n.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 2. RESIDENT DASHBOARD (OWNER / TENANT)
function renderResidentDashboard(roleType, flatNo) {
  const myBills = (store.state.bills || []).filter(b => b.flat === flatNo);
  const pendingBill = myBills.find(b => b.status === 'Pending');
  const myVisitors = (store.state.visitors || []).filter(v => v.flat === flatNo);
  const myTickets = (store.state.complaints || []).filter(c => c.flat === flatNo);

  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-house-user"></i> Resident Portal - Flat ${flatNo}</h2>
        <p class="page-subtitle">Manage guest passes, pay maintenance dues, and book society facilities</p>
      </div>
      <div class="header-btn-group">
        <button class="btn btn-primary" onclick="openModal('preApproveVisitorModal')">
          <i class="fa-solid fa-qrcode"></i> Pre-Approve Guest Pass
        </button>
        <button class="btn btn-secondary" onclick="openModal('fileComplaintModal')">
          <i class="fa-solid fa-wrench"></i> Raise Ticket
        </button>
      </div>
    </div>

    <!-- Quick Action Banners -->
    ${pendingBill ? `
      <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%); border: 1px solid var(--warning); border-radius: var(--radius-lg); padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h3 style="color: var(--warning); font-size: 1.1rem; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-circle-exclamation"></i> Maintenance Bill Due
          </h3>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 4px;">
            Invoice for <strong>${pendingBill.month}</strong> of <strong>₹${pendingBill.amount}</strong> is due on ${pendingBill.dueDate}.
          </p>
        </div>
        <button class="btn btn-warning" style="background:var(--warning); color:#000;" onclick="triggerPayModal('${pendingBill.id}', ${pendingBill.amount}, '${pendingBill.month}')">
          <i class="fa-solid fa-credit-card"></i> Pay Now (₹${pendingBill.amount})
        </button>
      </div>
    ` : `
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); border-radius: var(--radius-lg); padding: 16px 20px; display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.4rem;"></i>
        <div>
          <strong style="color: var(--success);">All Maintenance Dues Paid!</strong>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Thank you for keeping your account current.</p>
        </div>
      </div>
    `}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fa-solid fa-qrcode"></i></div>
        <div class="stat-info">
          <h4>Active Pre-Approvals</h4>
          <div class="stat-value">${myVisitors.filter(v => v.status === 'Pre-Approved').length} Guests</div>
          <div class="stat-subtext">Valid 6-Digit Gate PINs</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon purple"><i class="fa-solid fa-calendar-check"></i></div>
        <div class="stat-info">
          <h4>Facility Bookings</h4>
          <div class="stat-value">${(store.state.amenities || []).filter(a => a.bookedBy.includes(flatNo)).length} Booked</div>
          <div class="stat-subtext">Clubhouse / Gym / Pool</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon amber"><i class="fa-solid fa-screwdriver-wrench"></i></div>
        <div class="stat-info">
          <h4>My Support Tickets</h4>
          <div class="stat-value">${myTickets.length} Raised</div>
          <div class="stat-subtext">${myTickets.filter(t => t.status !== 'Resolved').length} Open / In-Progress</div>
        </div>
      </div>
    </div>

    <div class="dashboard-columns">
      <div>
        <!-- My Pre-approved Visitors & Logs -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-user-check"></i> My Visitor Gate Passes</h3>
            <button class="btn btn-sm btn-primary" onclick="openModal('preApproveVisitorModal')">+ New Pass</button>
          </div>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Category</th>
                  <th>6-Digit Gate PIN</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                ${myVisitors.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No visitors logged for your flat.</td></tr>` : ''}
                ${myVisitors.map(v => `
                  <tr>
                    <td><strong>${v.name}</strong><br><small style="color:var(--text-muted);">${v.phone}</small></td>
                    <td><span class="badge badge-info">${v.type}</span></td>
                    <td><strong style="background:var(--primary-light); color:var(--primary); padding:4px 8px; border-radius:4px; font-family:monospace; font-size:1rem;">${v.pin}</strong></td>
                    <td>
                      <span class="badge ${v.status === 'Checked In' ? 'badge-success' : v.status === 'Checked Out' ? 'badge-danger' : 'badge-warning'}">
                        ${v.status}
                      </span>
                    </td>
                    <td>${v.entryTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Service Requests -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-wrench"></i> My Support Requests</h3>
            <button class="btn btn-sm btn-secondary" onclick="openModal('fileComplaintModal')">Raise Issue</button>
          </div>
          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${myTickets.length === 0 ? `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No active tickets.</td></tr>` : ''}
                ${myTickets.map(t => `
                  <tr>
                    <td><strong>${t.title}</strong></td>
                    <td>${t.category}</td>
                    <td>${t.date}</td>
                    <td><span class="badge ${t.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${t.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sidebar Column -->
      <div>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-bullhorn"></i> Society Announcements</h3>
          </div>
          <div class="notice-list">
            ${(store.state.notices || []).slice(0, 3).map(n => `
              <div class="notice-card">
                <div class="notice-header">
                  <span class="notice-title">${n.title}</span>
                  <span class="notice-date">${n.date}</span>
                </div>
                <p class="notice-content">${n.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 3. SECURITY GATEKEEPER TERMINAL VIEW
function renderSecurityTerminalView() {
  const checkedInVisitors = (store.state.visitors || []).filter(v => v.status === 'Checked In');

  return `
    <div class="page-header">
      <div>
        <h2 class="page-title" style="color:var(--role-security);"><i class="fa-solid fa-shield-halved"></i> Gatekeeper Main Gate Terminal</h2>
        <p class="page-subtitle">Real-time visitor PIN verification, express entry, and live gate access log</p>
      </div>
      <div class="header-btn-group">
        <button class="btn btn-success" onclick="openModal('securityEntryModal')">
          <i class="fa-solid fa-plus"></i> Manual Visitor Check-in
        </button>
      </div>
    </div>

    <!-- Gatekeeper Keypad & Instant Verification Container -->
    <div class="gatekeeper-terminal">
      <div class="terminal-header">
        <div>
          <h3 style="font-size: 1.2rem;"><i class="fa-solid fa-qrcode"></i> Express Gate PIN Verification</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Ask guest for 6-digit PIN pass or scan pre-approval code</p>
        </div>
        <div class="gate-status-indicator">
          <div class="status-dot"></div> Main Gate Boom Barrier Online
        </div>
      </div>

      <div class="verification-box">
        <div class="pin-keypad-panel">
          <form id="keypadPinForm" onsubmit="handlePinVerificationSubmit(event)">
            <input type="text" class="pin-display-input" id="pinInputDisplay" maxlength="6" placeholder="______" readonly>
            <div class="pin-keypad">
              <button type="button" class="keypad-btn" onclick="pressKey('1')">1</button>
              <button type="button" class="keypad-btn" onclick="pressKey('2')">2</button>
              <button type="button" class="keypad-btn" onclick="pressKey('3')">3</button>
              <button type="button" class="keypad-btn" onclick="pressKey('4')">4</button>
              <button type="button" class="keypad-btn" onclick="pressKey('5')">5</button>
              <button type="button" class="keypad-btn" onclick="pressKey('6')">6</button>
              <button type="button" class="keypad-btn" onclick="pressKey('7')">7</button>
              <button type="button" class="keypad-btn" onclick="pressKey('8')">8</button>
              <button type="button" class="keypad-btn" onclick="pressKey('9')">9</button>
              <button type="button" class="keypad-btn" style="color:var(--danger);" onclick="clearPin()">C</button>
              <button type="button" class="keypad-btn" onclick="pressKey('0')">0</button>
              <button type="submit" class="keypad-btn" style="background:var(--success); color:#fff;"><i class="fa-solid fa-check"></i></button>
            </div>
          </form>
        </div>

        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase;">Quick Verification Result</h4>
            <div id="verificationResultBox" style="margin-top: 14px; text-align: center; padding: 20px; border: 2px dashed var(--border); border-radius: var(--radius-md);">
              <i class="fa-solid fa-shield-cat" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 8px;"></i>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Enter 6-digit PIN on the keypad to instantly verify & open gate barrier.</p>
            </div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 10px;">
            Emergency Contact Duty Officer: <strong>+91 99000 11223</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Gate Visitors Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-list-check"></i> Active Gate Visitors Inside Complex (${checkedInVisitors.length})</h3>
        <input type="text" class="form-control" placeholder="Search visitor name or flat..." style="max-width: 260px;" oninput="filterSecurityVisitors(this.value)">
      </div>
      <div class="table-responsive">
        <table class="custom-table" id="secVisitorsTable">
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Category</th>
              <th>Destination Flat</th>
              <th>Approved By</th>
              <th>Entry Time</th>
              <th>Gate Action</th>
            </tr>
          </thead>
          <tbody>
            ${(store.state.visitors || []).map(v => `
              <tr>
                <td><strong>${v.name}</strong><br><small style="color:var(--text-muted);">${v.phone}</small></td>
                <td><span class="badge badge-info">${v.type}</span></td>
                <td><strong style="color:var(--primary); font-size:0.95rem;">${v.flat}</strong></td>
                <td>${v.approvedBy}</td>
                <td>${v.entryTime}</td>
                <td>
                  <button class="btn btn-sm ${v.status === 'Checked In' ? 'btn-danger' : 'btn-success'}" onclick="store.toggleVisitorStatus('${v.id}')">
                    ${v.status === 'Checked In' ? '<i class="fa-solid fa-door-closed"></i> Mark Check-Out' : '<i class="fa-solid fa-door-open"></i> Allow Check-In'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. PRE-APPROVE VISITOR VIEW
function renderPreApproveView() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-qrcode"></i> Pre-Approve Guest Pass Generator</h2>
        <p class="page-subtitle">Generate an instant 6-digit access PIN for seamless entry at the main gate</p>
      </div>
    </div>

    <div style="max-width: 600px; margin: 0 auto;" class="card">
      <h3 style="margin-bottom: 16px; font-size: 1.1rem;"><i class="fa-solid fa-user-plus"></i> Create Instant Gate Pass</h3>
      <form id="standalonePreApproveForm">
        <div class="form-group">
          <label class="form-label">Visitor Full Name</label>
          <input type="text" class="form-control" id="stVisitorName" placeholder="e.g. Srikant Verma" required>
        </div>
        <div class="form-group">
          <label class="form-label">Visitor Contact Number</label>
          <input type="tel" class="form-control" id="stVisitorPhone" placeholder="+91 98765 00000" required>
        </div>
        <div class="form-group">
          <label class="form-label">Visitor Purpose / Type</label>
          <select class="form-control" id="stVisitorType">
            <option value="Guest">Guest / Relative</option>
            <option value="Delivery">Delivery (Amazon / Flipkart / Food)</option>
            <option value="Cab">Cab Driver (Uber/Ola)</option>
            <option value="Home Service">Maintenance / Maid</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
          <i class="fa-solid fa-qrcode"></i> Generate 6-Digit Gate PIN Pass
        </button>
      </form>
    </div>
  `;
}

// 5. VISITORS VIEW
function renderVisitorsView() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-user-shield"></i> Gate Visitors & Access Logs</h2>
        <p class="page-subtitle">Complete historical record of checked-in guests, delivery personnel, and service staff</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('securityEntryModal')">+ Log New Entry</button>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Visitor</th>
              <th>Category</th>
              <th>Destination</th>
              <th>PIN Code</th>
              <th>Status</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
            </tr>
          </thead>
          <tbody>
            ${(store.state.visitors || []).map(v => `
              <tr>
                <td><small style="color:var(--text-muted);">${v.id}</small></td>
                <td><strong>${v.name}</strong><br><small style="color:var(--text-muted);">${v.phone}</small></td>
                <td><span class="badge badge-info">${v.type}</span></td>
                <td><strong>${v.flat}</strong></td>
                <td><code>${v.pin}</code></td>
                <td><span class="badge ${v.status === 'Checked In' ? 'badge-success' : v.status === 'Checked Out' ? 'badge-danger' : 'badge-warning'}">${v.status}</span></td>
                <td>${v.entryTime}</td>
                <td>${v.exitTime}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 6. BILLING & MAINTENANCE VIEW
function renderBillingView(role) {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-file-invoice-dollar"></i> Society Maintenance & Billing</h2>
        <p class="page-subtitle">Monthly dues statement, online payment receipts, and financial records</p>
      </div>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Period</th>
              <th>Flat</th>
              <th>Owner / Resident</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${(store.state.bills || []).map(b => `
              <tr>
                <td><strong>${b.id}</strong></td>
                <td>${b.month}</td>
                <td><strong>${b.flat}</strong></td>
                <td>${b.owner}</td>
                <td><strong style="color:var(--primary); font-size:1rem;">₹${b.amount}</strong></td>
                <td>${b.dueDate}</td>
                <td><span class="badge ${b.status === 'Paid' ? 'badge-success' : 'badge-warning'}">${b.status}</span></td>
                <td>
                  ${b.status === 'Pending' ? `
                    <button class="btn btn-sm btn-primary" onclick="triggerPayModal('${b.id}', ${b.amount}, '${b.month}')">
                      <i class="fa-solid fa-credit-card"></i> Pay Now
                    </button>
                  ` : `
                    <button class="btn btn-sm btn-secondary" onclick="viewReceipt('${b.id}')">
                      <i class="fa-solid fa-receipt"></i> View Receipt
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. COMPLAINTS VIEW
function renderComplaintsView(role) {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-screwdriver-wrench"></i> Society Helpdesk & Complaints</h2>
        <p class="page-subtitle">Track, assign, and resolve maintenance tickets for plumbing, electrical, & common area issues</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('fileComplaintModal')">+ Raise Ticket</button>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Issue Summary</th>
              <th>Category</th>
              <th>Flat / Location</th>
              <th>Urgency</th>
              <th>Assigned Specialist</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${(store.state.complaints || []).map(c => `
              <tr>
                <td><small style="color:var(--text-muted);">${c.id}</small></td>
                <td><strong>${c.title}</strong><br><small style="color:var(--text-muted);">Raised by ${c.raisedBy} on ${c.date}</small></td>
                <td>${c.category}</td>
                <td><strong>${c.flat}</strong></td>
                <td><span class="badge ${c.urgency === 'Urgent' ? 'badge-danger' : 'badge-warning'}">${c.urgency}</span></td>
                <td>${c.assignedTo}</td>
                <td><span class="badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
                <td>
                  ${c.status !== 'Resolved' ? `
                    <button class="btn btn-sm btn-success" onclick="store.updateComplaintStatus('${c.id}', 'Resolved')">
                      <i class="fa-solid fa-check"></i> Mark Resolved
                    </button>
                  ` : '<span style="color:var(--success); font-size:0.85rem;"><i class="fa-solid fa-circle-check"></i> Solved</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 8. AMENITIES VIEW
function renderAmenitiesView(role) {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-calendar-check"></i> Amenity & Facility Bookings</h2>
        <p class="page-subtitle">Reserve Clubhouse party hall, tennis courts, and swimming pool slots online</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('bookAmenityModal')">+ Reserve Facility</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fa-solid fa-champagne-glasses"></i></div>
        <div class="stat-info">
          <h4>Clubhouse Hall</h4>
          <div class="stat-value">Available</div>
          <div class="stat-subtext">Capacity 150 Guests</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green"><i class="fa-solid fa-baseball-bat-ball"></i></div>
        <div class="stat-info">
          <h4>Tennis Court</h4>
          <div class="stat-value">Open</div>
          <div class="stat-subtext">Floodlights Active</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue"><i class="fa-solid fa-person-swimming"></i></div>
        <div class="stat-info">
          <h4>Swimming Pool</h4>
          <div class="stat-value">6:00 AM - 9:00 PM</div>
          <div class="stat-subtext">Lifeguard On Duty</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-clock"></i> Active Reservations</h3>
      </div>
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Facility</th>
              <th>Booked By Resident</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${(store.state.amenities || []).map(a => `
              <tr>
                <td><small style="color:var(--text-muted);">${a.id}</small></td>
                <td><strong>${a.facility}</strong></td>
                <td>${a.bookedBy}</td>
                <td>${a.date}</td>
                <td><strong style="color:var(--primary);">${a.slot}</strong></td>
                <td><span class="badge badge-success">${a.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 9. NOTICES VIEW
function renderNoticesView(role) {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-bullhorn"></i> Official Society Noticeboard</h2>
        <p class="page-subtitle">Announcements, event circulars, and estate management notices</p>
      </div>
      ${role === 'admin' ? `
        <button class="btn btn-primary" onclick="openModal('publishNoticeModal')">+ Publish New Notice</button>
      ` : ''}
    </div>

    <div class="notice-list">
      ${(store.state.notices || []).map(n => `
        <div class="notice-card">
          <div class="notice-header">
            <div>
              <span class="notice-title" style="font-size: 1.1rem;">${n.title}</span>
              <span class="badge badge-purple" style="margin-left: 8px;">${n.category}</span>
            </div>
            <span class="notice-date">${n.date} • By ${n.author}</span>
          </div>
          <p class="notice-content" style="font-size: 0.95rem; margin-top: 10px;">${n.content}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// 10. EMERGENCY SOS MONITORING VIEW
function renderEmergencyMonitoringView() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-title" style="color:var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Emergency SOS Command Monitoring</h2>
        <p class="page-subtitle">Live panic signals broadcasted by residents to security guards and estate admins</p>
      </div>
    </div>

    <div class="card" style="border: 2px solid var(--danger);">
      <div class="card-header">
        <h3 class="card-title" style="color:var(--danger);"><i class="fa-solid fa-bell"></i> Live Emergency Broadcasts</h3>
      </div>
      ${(!store.state.emergencyLogs || store.state.emergencyLogs.length === 0) ? `
        <div style="text-align:center; padding: 40px 0; color:var(--text-muted);">
          <i class="fa-solid fa-shield-heart" style="font-size: 3.5rem; color:var(--success); margin-bottom: 12px;"></i>
          <h3>All Clear - No Panic Signals Active</h3>
          <p style="font-size: 0.9rem;">Society security protocol is operating normally.</p>
        </div>
      ` : `
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Emergency Type</th>
                <th>Flat / Location</th>
                <th>Time Broadcast</th>
                <th>Special Note</th>
                <th>Response Status</th>
              </tr>
            </thead>
            <tbody>
              ${store.state.emergencyLogs.map(sos => `
                <tr style="background: rgba(239, 68, 68, 0.1);">
                  <td><strong style="color:var(--danger); font-size:1.05rem;"><i class="fa-solid fa-triangle-exclamation"></i> ${sos.category}</strong></td>
                  <td><strong style="font-size:1.1rem;">${sos.flat}</strong></td>
                  <td>${sos.timestamp}</td>
                  <td>${sos.note || 'Immediate Assistance Requested'}</td>
                  <td><span class="badge badge-danger">DISPATCHED GUARD</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// --- INTERACTIVE HANDLERS ---

// Keypad Input for Gatekeeper Terminal
let currentPinInput = '';

function pressKey(num) {
  if (currentPinInput.length < 6) {
    currentPinInput += num;
    document.getElementById('pinInputDisplay').value = currentPinInput;
  }
}

function clearPin() {
  currentPinInput = '';
  document.getElementById('pinInputDisplay').value = '';
}

function handlePinVerificationSubmit(e) {
  e.preventDefault();
  if (currentPinInput.length !== 6) {
    showToast('Please enter a full 6-digit PIN code.', 'warning');
    return;
  }

  const res = store.checkInVisitorByPin(currentPinInput);
  const resultBox = document.getElementById('verificationResultBox');

  if (res.success) {
    showToast(`VERIFIED: Entry Approved for ${res.visitor.name} to Flat ${res.visitor.flat}`, 'success');
    resultBox.innerHTML = `
      <div style="color:var(--success);">
        <i class="fa-solid fa-circle-check" style="font-size:3rem; margin-bottom:10px;"></i>
        <h3 style="font-size:1.2rem;">ENTRY APPROVED!</h3>
        <p style="font-size:0.95rem; margin-top:4px;">Guest: <strong>${res.visitor.name}</strong></p>
        <p style="font-size:0.9rem;">Destination: <strong>Flat ${res.visitor.flat}</strong></p>
        <span class="badge badge-success" style="margin-top:10px; font-size:0.85rem;">GATE BARRIER OPENED</span>
      </div>
    `;
    clearPin();
    renderApp();
  } else {
    showToast('INVALID PIN PASS OR ALREADY CHECKED IN!', 'danger');
    resultBox.innerHTML = `
      <div style="color:var(--danger);">
        <i class="fa-solid fa-circle-xmark" style="font-size:3rem; margin-bottom:10px;"></i>
        <h3 style="font-size:1.2rem;">ACCESS DENIED</h3>
        <p style="font-size:0.9rem; margin-top:4px;">No active pre-approved guest found with PIN ${currentPinInput}.</p>
      </div>
    `;
    clearPin();
  }
}

// Filter Security Visitors Table
function filterSecurityVisitors(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#secVisitorsTable tbody tr');
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    r.style.display = text.includes(q) ? '' : 'none';
  });
}

// Populate Flat Dropdown in Modals
function populateFlatSelect() {
  const select = document.getElementById('secFlatSelect');
  if (!select) return;
  select.innerHTML = '';
  const blocks = ['A', 'B', 'C', 'D'];
  blocks.forEach(b => {
    for (let f = 101; f <= 104; f++) {
      const flatStr = `${b}-${f}`;
      const opt = document.createElement('option');
      opt.value = flatStr;
      opt.textContent = `Flat ${flatStr}`;
      select.appendChild(opt);
    }
  });
}

// Trigger Payment Modal
function triggerPayModal(billId, amount, period) {
  document.getElementById('payBillId').value = billId;
  document.getElementById('billAmountText').textContent = `₹${amount.toLocaleString()}.00`;
  document.getElementById('billPeriodText').textContent = period;
  openModal('payBillModal');
}

// View Printable Receipt Modal
function viewReceipt(billId) {
  const b = (store.state.bills || []).find(item => item.id === billId);
  if (!b) return;

  const content = document.getElementById('receiptContent');
  content.innerHTML = `
    <div class="receipt-box">
      <div class="receipt-header">
        <h2 style="font-size:1.2rem; font-weight:bold;">GRAND VIEW HEIGHTS CHS</h2>
        <p style="font-size:0.8rem; color:#64748b;">Gated Community Society Maintenance Receipt</p>
      </div>
      <div class="receipt-row"><span>Receipt No:</span><strong>REC-${b.id}</strong></div>
      <div class="receipt-row"><span>Billing Month:</span><span>${b.month}</span></div>
      <div class="receipt-row"><span>Flat No:</span><span>${b.flat}</span></div>
      <div class="receipt-row"><span>Paid By:</span><span>${b.owner}</span></div>
      <div class="receipt-row"><span>Payment Ref:</span><span>${b.paymentRef || 'UPI-98210492'}</span></div>
      <div class="receipt-row"><span>Payment Date:</span><span>${b.paidDate || '2026-07-28'}</span></div>
      <hr style="margin:12px 0; border:none; border-top:1px dashed #cbd5e1;">
      <div class="receipt-row"><span>Society Maintenance:</span><span>₹${b.breakdown.maintenance}</span></div>
      <div class="receipt-row"><span>Water & Sanitation:</span><span>₹${b.breakdown.water}</span></div>
      <div class="receipt-row"><span>Clubhouse Amenities:</span><span>₹${b.breakdown.clubhouse}</span></div>
      <div class="receipt-row receipt-total">
        <span>TOTAL PAID:</span>
        <span>₹${b.amount}.00</span>
      </div>
      <p style="text-align:center; font-size:0.75rem; color:#64748b; margin-top:14px;">Computer Generated Official Receipt • HavenOS</p>
    </div>
  `;
  openModal('receiptModal');
}

// --- 7. EVENT LISTENERS & FORM SUBMISSIONS ---
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();

  // Login Form Submission
  const loginAuthForm = document.getElementById('loginAuthForm');
  if (loginAuthForm) {
    loginAuthForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const pass = document.getElementById('loginPassword').value;
      const role = document.getElementById('loginRoleSelect').value;
      store.login(email, pass, role);
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
    });
  }

  // Admin Add User Form Submission
  const addUserForm = document.getElementById('addUserForm');
  if (addUserForm) {
    addUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('newUserRoleSelect').value;
      const name = document.getElementById('newUserName').value;
      const email = document.getElementById('newUserEmail').value;
      const password = document.getElementById('newUserPassword').value;
      const flat = document.getElementById('newUserFlat').value || (role === 'owner' ? 'C-302' : 'N/A');

      const u = store.addNewUser({ role, name, email, password, flat });
      closeModal('addUserModal');
      addUserForm.reset();
      showToast(`Registered New ${role.toUpperCase()}: ${u.name}! Can log in with email ${u.email}`, 'success');
      currentTab = 'users';
      renderApp();
    });
  }

  // Owner Add Tenant Form Submission
  const addTenantForm = document.getElementById('addTenantForm');
  if (addTenantForm) {
    addTenantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ownerFlat = (store.state.users && store.state.users['owner'] && store.state.users['owner'].flat) || 'A-402';
      const name = document.getElementById('tenantName').value;
      const email = document.getElementById('tenantEmail').value;
      const password = document.getElementById('tenantPassword').value;

      const u = store.addNewUser({ role: 'tenant', name, email, password, flat: ownerFlat });
      closeModal('addTenantModal');
      addTenantForm.reset();
      showToast(`Registered New Tenant ${u.name} for Flat ${ownerFlat}! Login enabled for ${u.email}`, 'success');
      currentTab = 'tenants';
      renderApp();
    });
  }

  // Theme Toggle Button
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      store.toggleTheme();
    });
  }

  // Header SOS Button
  const headerSosBtn = document.getElementById('headerSosBtn');
  if (headerSosBtn) {
    headerSosBtn.addEventListener('click', () => {
      openModal('sosModal');
    });
  }

  // Slot Selection Handler in Amenity Modal
  const slotGrid = document.getElementById('slotGrid');
  if (slotGrid) {
    slotGrid.addEventListener('click', (e) => {
      const slot = e.target.closest('.slot-item');
      if (slot && !slot.classList.contains('booked')) {
        slotGrid.querySelectorAll('.slot-item').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        document.getElementById('selectedSlotValue').value = slot.getAttribute('data-slot');
      }
    });
  }

  // Pre-Approve Visitor Form Submission (Modal)
  const preApproveForm = document.getElementById('preApproveForm');
  if (preApproveForm) {
    preApproveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentRole = store.state.currentRole;
      const flat = (store.state.users && store.state.users[currentRole] && store.state.users[currentRole].flat) || 'A-402';

      const vis = store.addVisitor({
        name: document.getElementById('visitorName').value,
        phone: document.getElementById('visitorPhone').value,
        type: document.getElementById('visitorType').value,
        flat: flat,
        approvedBy: store.state.users[currentRole].name
      });

      closeModal('preApproveVisitorModal');
      preApproveForm.reset();
      showToast(`Gate Pass Created! 6-Digit PIN: ${vis.pin}`, 'success');
      renderApp();
    });
  }

  // Standalone Pre-Approve Form
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'standalonePreApproveForm') {
      e.preventDefault();
      const currentRole = store.state.currentRole;
      const flat = (store.state.users && store.state.users[currentRole] && store.state.users[currentRole].flat) || 'A-402';

      const vis = store.addVisitor({
        name: document.getElementById('stVisitorName').value,
        phone: document.getElementById('stVisitorPhone').value,
        type: document.getElementById('stVisitorType').value,
        flat: flat,
        approvedBy: store.state.users[currentRole].name
      });

      showToast(`Gate PIN Generated: ${vis.pin}`, 'success');
      currentTab = 'visitors';
      renderApp();
    }
  });

  // Manual Security Entry Form
  const manualEntryForm = document.getElementById('manualEntryForm');
  if (manualEntryForm) {
    manualEntryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      store.addVisitor({
        name: document.getElementById('secVisitorName').value,
        phone: '+91 Gate Verified',
        type: document.getElementById('secCategory').value,
        flat: document.getElementById('secFlatSelect').value,
        status: 'Checked In',
        entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        approvedBy: 'Main Gate Guard'
      });

      closeModal('securityEntryModal');
      manualEntryForm.reset();
      showToast('Visitor Check-in Recorded Successfully!', 'success');
      renderApp();
    });
  }

  // Pay Maintenance Bill Form
  const payBillForm = document.getElementById('payBillForm');
  if (payBillForm) {
    payBillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('payBillId').value;
      const ref = document.getElementById('payReferenceInput').value;

      const updatedBill = store.payBill(id, ref);
      closeModal('payBillModal');
      payBillForm.reset();
      showToast('Payment Successful! Receipt Generated.', 'success');
      viewReceipt(id);
    });
  }

  // Printable Receipt Action
  const printBtn = document.getElementById('printReceiptBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Raise Complaint Form
  const complaintForm = document.getElementById('complaintForm');
  if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = store.state.currentRole;
      const flat = (store.state.users && store.state.users[role] && store.state.users[role].flat) || 'A-402';
      store.addComplaint({
        title: document.getElementById('complaintTitle').value,
        category: document.getElementById('complaintCategory').value,
        flat: flat,
        raisedBy: store.state.users[role].name,
        urgency: document.getElementById('complaintUrgency').value
      });

      closeModal('fileComplaintModal');
      complaintForm.reset();
      showToast('Service Request Ticket Created!', 'success');
    });
  }

  // Book Amenity Form
  const amenityForm = document.getElementById('amenityForm');
  if (amenityForm) {
    amenityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const slotVal = document.getElementById('selectedSlotValue').value;
      if (!slotVal) {
        showToast('Please select a time slot for the facility.', 'warning');
        return;
      }
      const role = store.state.currentRole;
      store.addAmenityBooking({
        facility: document.getElementById('amenitySelect').value,
        bookedBy: store.state.users[role].name,
        date: document.getElementById('amenityDate').value,
        slot: slotVal
      });

      closeModal('bookAmenityModal');
      amenityForm.reset();
      showToast('Facility Reservation Confirmed!', 'success');
    });
  }

  // Publish Notice Form
  const noticeForm = document.getElementById('noticeForm');
  if (noticeForm) {
    noticeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const notice = store.addNotice({
        title: document.getElementById('noticeTitle').value,
        category: document.getElementById('noticeCategory').value,
        content: document.getElementById('noticeContent').value
      });

      closeModal('publishNoticeModal');
      noticeForm.reset();
      showToast('Society Notice Published!', 'success');
    });
  }

  // Emergency SOS Form
  const sosForm = document.getElementById('sosForm');
  if (sosForm) {
    sosForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sos = store.triggerSos({
        category: document.getElementById('sosCategory').value,
        flat: document.getElementById('sosFlat').value,
        note: document.getElementById('sosNote').value
      });

      closeModal('sosModal');
      sosForm.reset();
      showToast(`EMERGENCY SOS BROADCASTED FOR ${sos.flat}! Security guard dispatched.`, 'danger');
    });
  }

  // Initial App Render
  renderApp();
});
