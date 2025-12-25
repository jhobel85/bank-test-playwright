import { test } from '@playwright/test';
import { DashboardPage } from '../page-objects/DashboardPage';

test.describe('Dashboard Tests', () => {
  // @ts-ignore
  test('should display welcome message', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyWelcomeMessage('Welcome to Your Dashboard');
  });
});
