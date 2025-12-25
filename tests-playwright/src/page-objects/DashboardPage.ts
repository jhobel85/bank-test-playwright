import { Page } from '@playwright/test';

// Page Object for dashboard page using Playwright and TypeScript.
// Include methods: goto(), verifyWelcomeMessage().
export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }

  async verifyWelcomeMessage(expectedMessage: string) {
    const welcomeMessage = await this.page.textContent('h1.welcome');
    if (welcomeMessage !== expectedMessage) {
      throw new Error(`Expected welcome message to be '${expectedMessage}', but got '${welcomeMessage}'`);
    }
  }
}
