import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  retries: 2,
  reporter: 'html',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    // Toggle via env var; defaults to false to avoid stale servers.
    reuseExistingServer: process.env.REUSE_EXISTING_SERVER === 'FALSE',
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
