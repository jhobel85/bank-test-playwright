import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

test.describe('Login', () => {
  // @ts-ignore
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user', 'password');
    await expect(page).toHaveURL(/dashboard/);
  });
});
