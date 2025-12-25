import { test, expect } from '@playwright/test';

test.describe('API Tests - Accounts', () => {
  test('GET /api/accounts returns all accounts', async ({ request }) => {
    const response = await request.get('/api/accounts');
    expect(response.ok()).toBeTruthy();
    
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
    expect(json.data.length).toBeGreaterThan(0);
    
    // Verify account structure
    const account = json.data[0];
    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('name');
    expect(account).toHaveProperty('balance');
    expect(account).toHaveProperty('currency');
  });

  test('GET /api/accounts/:id/transactions returns account transactions', async ({ request }) => {
    const response = await request.get('/api/accounts/ACC-001/transactions');
    expect(response.ok()).toBeTruthy();
    
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveProperty('account');
    expect(json.data).toHaveProperty('transactions');
    expect(json.data.account.id).toBe('ACC-001');
    expect(json.data.transactions).toBeInstanceOf(Array);
    expect(json.data.transactions.length).toBeGreaterThan(0);
    
    // Verify transaction structure
    const tx = json.data.transactions[0];
    expect(tx).toHaveProperty('id');
    expect(tx).toHaveProperty('date');
    expect(tx).toHaveProperty('type');
    expect(tx).toHaveProperty('amount');
    expect(tx).toHaveProperty('description');
    expect(tx.accountId).toBe('ACC-001');
  });

  test('GET /api/accounts/:id/transactions returns 404 for non-existent account', async ({ request }) => {
    const response = await request.get('/api/accounts/INVALID-ID/transactions');
    expect(response.status()).toBe(404);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('not found');
  });
});

test.describe('API Tests - Transfers', () => {
  test('POST /api/transfer creates a valid transfer', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'ACC-001',
        toAccountId: 'ACC-002',
        amount: 100.50,
        description: 'Test transfer'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveProperty('id');
    expect(json.data.fromAccountId).toBe('ACC-001');
    expect(json.data.toAccountId).toBe('ACC-002');
    expect(json.data.amount).toBe(100.50);
    expect(json.data.description).toBe('Test transfer');
    expect(json.data.status).toBe('completed');
  });

  test('POST /api/transfer rejects missing fields', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'ACC-001',
        amount: 100
        // Missing toAccountId
      }
    });
    
    expect(response.status()).toBe(400);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('required fields');
  });

  test('POST /api/transfer rejects zero amount', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'ACC-001',
        toAccountId: 'ACC-002',
        amount: 0
      }
    });
    
    expect(response.status()).toBe(400);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('positive number');
  });

  test('POST /api/transfer rejects negative amount', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'ACC-001',
        toAccountId: 'ACC-002',
        amount: -50
      }
    });
    
    expect(response.status()).toBe(400);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('positive number');
  });

  test('POST /api/transfer rejects non-numeric amount', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'ACC-001',
        toAccountId: 'ACC-002',
        amount: 'abc'
      }
    });
    
    expect(response.status()).toBe(400);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('positive number');
  });

  test('POST /api/transfer rejects non-existent source account', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'INVALID-ID',
        toAccountId: 'ACC-002',
        amount: 100
      }
    });
    
    expect(response.status()).toBe(404);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Source account');
  });

  test('POST /api/transfer rejects non-existent destination account', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'ACC-001',
        toAccountId: 'INVALID-ID',
        amount: 100
      }
    });
    
    expect(response.status()).toBe(404);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Destination account');
  });

  test('POST /api/transfer rejects insufficient funds', async ({ request }) => {
    const response = await request.post('/api/transfer', {
      data: {
        fromAccountId: 'ACC-001',
        toAccountId: 'ACC-002',
        amount: 999999
      }
    });
    
    expect(response.status()).toBe(400);
    
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Insufficient funds');
  });
});
