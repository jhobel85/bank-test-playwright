"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferPage = void 0;
// Page Object for transfer page using Playwright and TypeScript.
// Include methods: goto(), makeTransfer().
class TransferPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async goto() {
        await this.page.goto('/transfer');
    }
    async makeTransfer(account, amount) {
        await this.page.fill('input[name="account"]', account);
        await this.page.fill('input[name="amount"]', amount);
        await this.page.click('button[type="submit"]');
    }
}
exports.TransferPage = TransferPage;
