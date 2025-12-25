const { test } = require('@playwright/test');
const { DashboardPage } = require('../page-objects/DashboardPage.js');

// JS tests using the CommonJS-compiled DashboardPage.js
test.describe('Dashboard JS Tests', () => {
  test('should display welcome message (JS)', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyWelcomeMessage('Welcome to Your Dashboard');
  });
});
