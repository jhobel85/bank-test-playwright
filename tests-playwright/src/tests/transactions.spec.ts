import { test } from '@playwright/test';
import { AccountDetailPage } from '../page-objects/AccountDetailPage';

test.describe('Transaction history scenarios', () => {
  test('displays all transactions by default', async ({ page }) => {
    const accountPage = new AccountDetailPage(page);
    
    await accountPage.goto();
    await accountPage.expectAccountName('Primary Checking');
    await accountPage.expectRowCount(4);
  });

  test('shows empty result when filter matches nothing', async ({ page }) => {
    const accountPage = new AccountDetailPage(page);
    
    await accountPage.goto();
    await accountPage.applyFilters({ type: 'Credit', minAmount: 10000 });
    await accountPage.expectRowCount(0);
  });

  test('filters by minimum amount only', async ({ page }) => {
    const accountPage = new AccountDetailPage(page);
    
    await accountPage.goto();
    await accountPage.applyFilters({ minAmount: 100 });
    await accountPage.expectRowCount(3); // Salary, Groceries, Refund
    await accountPage.expectTransactionVisible('Salary');
    await accountPage.expectTransactionVisible('Groceries');
    await accountPage.expectTransactionVisible('Refund');
  });

  test('filters by maximum amount only', async ({ page }) => {
    const accountPage = new AccountDetailPage(page);
    
    await accountPage.goto();
    await accountPage.applyFilters({ maxAmount: 100 });
    await accountPage.expectRowCount(1); // Gas
    await accountPage.expectTransactionVisible('Gas');
  });

  test('filters credit transactions', async ({ page }) => {
    const accountPage = new AccountDetailPage(page);
    
    await accountPage.goto();
    await accountPage.applyFilters({ type: 'Credit' });
    await accountPage.expectRowCount(2); // Salary, Refund
    await accountPage.expectTransactionVisible('Salary');
    await accountPage.expectTransactionVisible('Refund');
  });

  test('filters debit transactions', async ({ page }) => {
    const accountPage = new AccountDetailPage(page);
    
    await accountPage.goto();
    await accountPage.applyFilters({ type: 'Debit' });
    await accountPage.expectRowCount(2); // Groceries, Gas
    await accountPage.expectTransactionVisible('Groceries');
    await accountPage.expectTransactionVisible('Gas');
  });
});
