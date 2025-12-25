const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Load fixture data
const accounts = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'accounts.json'), 'utf8'));
const transactions = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'transactions.json'), 'utf8'));

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

app.get(['/account/:id', '/account'], (req, res) => {
  const accountId = req.params.id || 'ACC-001';
  const account = accounts.find(acc => acc.id === accountId) || accounts[0];
  const accountTransactions = transactions.filter(tx => tx.accountId === accountId);
  
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Account Detail</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; }
          .balance { margin: 8px 0 16px; font-size: 1.1rem; }
          .filters { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 16px; }
          .filters label { display: flex; flex-direction: column; font-size: 0.9rem; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background: #f5f5f5; text-align: left; }
        </style>
      </head>
      <body>
        <h1 class="account-name">${account.name}</h1>
        <div class="balance">Account: ${account.id} | Balance: ${account.balance.toFixed(2)} ${account.currency}</div>

        <div class="filters">
          <label>Type
            <select id="typeFilter">
              <option value="All">All</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </label>
          <label>Min amount
            <input id="minAmount" type="number" step="0.01" />
          </label>
          <label>Max amount
            <input id="maxAmount" type="number" step="0.01" />
          </label>
          <button id="applyFilters">Apply filters</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody id="transactionsBody"></tbody>
        </table>

        <script>
          const data = {
            id: '${account.id}',
            name: '${account.name}',
            balance: ${account.balance},
            currency: '${account.currency}',
            transactions: ${JSON.stringify(accountTransactions)}
          };
          const tbody = document.getElementById('transactionsBody');

          function render(rows) {
            tbody.innerHTML = rows.map(tx => (
              '<tr data-type="' + tx.type + '" data-amount="' + tx.amount + '" data-id="' + tx.id + '">' +
                '<td>' + tx.date + '</td>' +
                '<td>' + tx.type + '</td>' +
                '<td>' + tx.amount.toFixed(2) + '</td>' +
                '<td class="tx-desc">' + tx.description + '</td>' +
              '</tr>'
            )).join('');
          }

          function applyFilters() {
            const type = document.getElementById('typeFilter').value;
            const min = parseFloat(document.getElementById('minAmount').value);
            const max = parseFloat(document.getElementById('maxAmount').value);

            const filtered = data.transactions.filter(tx => {
              if (type !== 'All' && tx.type !== type) return false;
              if (!Number.isNaN(min) && tx.amount < min) return false;
              if (!Number.isNaN(max) && tx.amount > max) return false;
              return true;
            });
            render(filtered);
          }

          document.getElementById('applyFilters').addEventListener('click', applyFilters);
          render(data.transactions);
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
