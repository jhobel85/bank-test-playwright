"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
// Page Object for login page using Playwright and TypeScript.
// Include methods: goto(), login(), expectErrorMessage().
class LoginPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async goto() {
        await this.page.goto('/login');
    }
    async login(username, password) {
        await this.page.fill('input[name="username"]', username);
        await this.page.fill('input[name="password"]', password);
        await this.page.click('button[type="submit"]');
    }
}
exports.LoginPage = LoginPage;
