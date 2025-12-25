import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  retries: 2,
  reporter: 'html',
  webServer: {
    command: 'node start-server.js',
    port: 3000,
    cwd: '.',
    // Always start a fresh server and stop it after tests finish
    reuseExistingServer: true,
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
