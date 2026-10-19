import { test, expect } from '../../fixtures/test-fixtures';
import { adminUser } from '../../test-data/users';

// Test case spec: docs/test-cases/critical-regression-test-cases.md#TC_001
test.describe('Authentication', () => {
  test('TC_001 - Login with valid credentials @critical @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.goto();
    await expect(loginPage.password).toHaveAttribute('type', 'password');

    await loginPage.login(adminUser.username, adminUser.password);

    await dashboardPage.expectLoaded();
    for (const item of ['Admin', 'PIM', 'Leave', 'Dashboard']) {
      await expect(dashboardPage.menuItem(item)).toBeVisible();
    }
  });
});
