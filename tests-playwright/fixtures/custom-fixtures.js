"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const test_1 = require("@playwright/test");
// Extend base test with custom fixtures if needed.
const test = test_1.test.extend({
// Example: Add custom fixtures here.
});
exports.test = test;
