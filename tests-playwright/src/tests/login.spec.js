const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page-objects/LoginPage.js');

// JS tests using the CommonJS-compiled LoginPage.js
test.describe('Login JS', () => {
  test('should login with valid credentials (JS)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user', 'password');
    await expect(page).toHaveURL(/dashboard/);
  });
});
