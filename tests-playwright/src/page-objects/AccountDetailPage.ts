import { expect, Page } from '@playwright/test';

export class AccountDetailPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/account');
  }

  async applyFilters(options: { type?: 'All' | 'Credit' | 'Debit'; minAmount?: number; maxAmount?: number }) {
    const { type = 'All', minAmount, maxAmount } = options;
    await this.page.selectOption('#typeFilter', type);
    await this.page.fill('#minAmount', minAmount !== undefined ? String(minAmount) : '');
    await this.page.fill('#maxAmount', maxAmount !== undefined ? String(maxAmount) : '');
    await this.page.click('#applyFilters');
  }

  async expectRowCount(expected: number) {
    await expect(this.page.locator('#transactionsBody tr')).toHaveCount(expected);
  }

  async expectTransactionVisible(description: string) {
    await expect(this.page.locator('#transactionsBody .tx-desc', { hasText: description })).toBeVisible();
  }

  async expectAccountName(name: string) {
    await expect(this.page.locator('h1.account-name')).toHaveText(name);
  }
}
