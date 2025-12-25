import { test } from '@playwright/test';
import { AccountDetailPage } from '../page-objects/AccountDetailPage';

test.describe('Account detail and transaction filters', () => {
  test('filters by type and amount', async ({ page }) => {
    const accountPage = new AccountDetailPage(page);

    await accountPage.goto();
    await accountPage.expectAccountName('Primary Checking');
    await accountPage.expectRowCount(4);

    await accountPage.applyFilters({ type: 'Credit', minAmount: 150 });
    await accountPage.expectRowCount(2);
    await accountPage.expectTransactionVisible('Salary');
    await accountPage.expectTransactionVisible('Refund');

    await accountPage.applyFilters({ type: 'Debit', maxAmount: 100 });
    await accountPage.expectRowCount(1);
    await accountPage.expectTransactionVisible('Gas');
  });
});
