const { test, expect } = require('@playwright/test');
const { TransferPage } = require('../page-objects/TransferPage.js');

// JS tests using the CommonJS-compiled TransferPage.js
test.describe('Transfer JS Tests', () => {
  test('should make a successful transfer (JS)', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await transferPage.makeTransfer('123456', '100');
    await expect(page.locator('.success-message')).toHaveText('Transfer successful');
  });
});
