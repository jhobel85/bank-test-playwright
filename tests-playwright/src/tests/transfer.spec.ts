import { test, expect } from '@playwright/test';
import { TransferPage } from '../page-objects/TransferPage';

test.describe('Transfer Tests', () => {
  test('should make a successful transfer', async ({ page }) => {
    const transferPage = new TransferPage(page);
    await transferPage.goto();
    await transferPage.makeTransfer('123456', '100');
    await expect(page.locator('.success-message')).toHaveText('Transfer successful');
  });
});
