// Example page object for login page
import { Page } from '@playwright/test';

// Page Object for login page using Playwright and TypeScript.
// Include methods: goto(), login(), expectErrorMessage().
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}



