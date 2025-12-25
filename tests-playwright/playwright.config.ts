import { defineConfig } from '@playwright/test';
// Fix TS compile error when Node types aren't available
// (__dirname is a Node global; declare it for type-checking only)
declare const __dirname: string;

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  retries: 2,
  reporter: 'html',
  webServer: {
    command: 'node start-server.js',
    port: 3000,
    cwd: __dirname,
    //true = Always start a fresh server and stop it after tests finish
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
});
