"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardPage = void 0;
// Page Object for dashboard page using Playwright and TypeScript.
// Include methods: goto(), verifyWelcomeMessage().
class DashboardPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async goto() {
        await this.page.goto('/dashboard');
    }
    async verifyWelcomeMessage(expectedMessage) {
        const welcomeMessage = await this.page.textContent('h1.welcome');
        if (welcomeMessage !== expectedMessage) {
            throw new Error(`Expected welcome message to be '${expectedMessage}', but got '${welcomeMessage}'`);
        }
    }
}
exports.DashboardPage = DashboardPage;
