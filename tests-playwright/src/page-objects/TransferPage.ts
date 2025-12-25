import { Page } from '@playwright/test';

// Page Object for transfer page using Playwright and TypeScript.
// Include methods: goto(), makeTransfer().
export class TransferPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/transfer');
  }

  async makeTransfer(account: string, amount: string) {
    await this.page.fill('input[name="account"]', account);
    await this.page.fill('input[name="amount"]', amount);
    await this.page.click('button[type="submit"]');
  }
}
