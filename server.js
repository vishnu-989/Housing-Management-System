/* ==========================================================================
   Full Stack Node.js Backend Server for Housing Society Management
   Integrated with Relational DBMS Engine (SocietyDBMS / database.sql)
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dbms = require('./dbms');

const PORT = process.env.PORT || 3000;

// MIME Types map
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- REST API ENDPOINTS VIA RELATIONAL DBMS ---
  if (pathname.startsWith('/api/')) {

    if (pathname === '/api/state' && method === 'GET') {
      const fullState = dbms.getFullState();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fullState));
      return;
    }

    if (pathname === '/api/visitors' && method === 'GET') {
      const visitors = dbms.queryAll('visitors');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(visitors));
      return;
    }

    // Helper to read request JSON body
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      let payload = {};
      try { if (body) payload = JSON.parse(body); } catch (e) {}

      // INSERT INTO users (Admin adding Admin/Owner/Security, Owner adding Tenant)
      if (pathname === '/api/users' && method === 'POST') {
        const newUser = {
          id: Date.now(),
          email: payload.email,
          password: payload.password,
          name: payload.name,
          role: payload.role,
          flat: payload.flat || 'N/A',
          avatar: payload.avatar || payload.name.substring(0, 2).toUpperCase()
        };
        dbms.insert('usersList', newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: newUser }));
        return;
      }

      // INSERT INTO visitors
      if (pathname === '/api/visitors' && method === 'POST') {
        const newVis = {
          id: 'VIS-' + (Math.floor(Math.random() * 900) + 100),
          name: payload.name,
          phone: payload.phone,
          type: payload.type,
          flat: payload.flat,
          pin: payload.pin || String(Math.floor(100000 + Math.random() * 900000)),
          status: payload.status || 'Pre-Approved',
          entryTime: payload.entryTime || 'Expected Soon',
          exitTime: '--',
          approvedBy: payload.approvedBy
        };
        dbms.insert('visitors', newVis);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, visitor: newVis }));
        return;
      }

      // UPDATE visitors SET status = 'Checked Out' / 'Checked In'
      if (pathname === '/api/visitors/toggle' && method === 'POST') {
        const updated = dbms.updateWhere('visitors', v => v.id === payload.id, v => {
          if (v.status === 'Checked In' || v.status === 'Pre-Approved') {
            v.status = 'Checked Out';
            v.exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else {
            v.status = 'Checked In';
            v.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        });

        if (updated) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, visitor: updated }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false }));
        }
        return;
      }

      // SELECT FROM visitors WHERE pin = ?
      if (pathname === '/api/visitors/verify' && method === 'POST') {
        let matched = null;
        dbms.updateWhere('visitors', v => v.pin === payload.pin && v.status === 'Pre-Approved', v => {
          v.status = 'Checked In';
          v.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          matched = v;
        });

        if (matched) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, visitor: matched }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid or already used PIN' }));
        }
        return;
      }

      // UPDATE bills SET status = 'Paid'
      if (pathname === '/api/bills/pay' && method === 'POST') {
        const updatedBill = dbms.updateWhere('bills', b => b.id === payload.billId, b => {
          b.status = 'Paid';
          b.paidDate = new Date().toISOString().split('T')[0];
          b.paymentRef = payload.ref || ('UPI-' + Math.floor(Math.random() * 89999999 + 10000000));
        });

        if (updatedBill) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, bill: updatedBill }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false }));
        }
        return;
      }

      // INSERT INTO emergency_sos
      if (pathname === '/api/sos' && method === 'POST') {
        const sos = {
          id: 'SOS-' + Date.now(),
          category: payload.category,
          flat: payload.flat,
          note: payload.note,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        dbms.insert('emergencyLogs', sos);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, sos: sos }));
        return;
      }

      // Default API Fallback
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    });
    return;
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🏡 Housing Society Relational DBMS Full-Stack Server`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
