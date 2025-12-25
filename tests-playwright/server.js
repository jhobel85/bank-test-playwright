const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Login</title>
      </head>
      <body>
        <h1>Login</h1>
        <form id="loginForm">
          <label>Username <input name="username" /></label>
          <label>Password <input name="password" type="password" /></label>
          <button type="submit">Login</button>
        </form>
        <script>
          document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = '/dashboard';
          });
        </script>
      </body>
    </html>
  `);
});

app.get('/dashboard', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Dashboard</title>
      </head>
      <body>
        <h1 class="welcome">Welcome to Your Dashboard</h1>
      </body>
    </html>
  `);
});

app.get('/transfer', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Transfer</title>
      </head>
      <body>
        <h1>Transfer</h1>
        <form id="transferForm">
          <label>Account <input name="account" /></label>
          <label>Amount <input name="amount" /></label>
          <button type="submit">Submit</button>
        </form>
        <div class="success-message" aria-live="polite"></div>
        <script>
          document.getElementById('transferForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.querySelector('.success-message').textContent = 'Transfer successful';
          });
        </script>
      </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Test app listening on http://localhost:${port}`);
});

// Disable keep-alive to ensure connections close properly
server.keepAliveTimeout = 0;

// Track all connections
const connections = new Set();

server.on('connection', (conn) => {
  connections.add(conn);
  conn.on('close', () => {
    connections.delete(conn);
  });
});

// Graceful shutdown handling
function shutdown(signal) {
  console.log(`${signal} received, closing server...`);
  
  // Close server to stop accepting new connections
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  
  // Force close all existing connections
  for (const conn of connections) {
    conn.destroy();
  }
  
  // Force exit after 5 seconds if server hasn't closed
  setTimeout(() => {
    console.log('Forcing shutdown...');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
