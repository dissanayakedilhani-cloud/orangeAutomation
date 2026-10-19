import { test, expect } from '../../fixtures/test-fixtures';
import { invalidUsers } from '../../test-data/users';

// Test case spec: docs/test-cases/critical-regression-test-cases.md#TC_002
test.describe('Authentication - TC_002 - Login with invalid credentials is rejected @critical @security', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  for (const user of invalidUsers) {
    test(`TC_002 - rejects ${user.case}`, async ({ loginPage }) => {
      await loginPage.login(user.username, user.password);

      await expect(loginPage.errorAlert).toHaveText('Invalid credentials');
      await loginPage.expectOnLoginPage();
    });
  }

  test('TC_002 - shows Required validation for empty fields', async ({ loginPage }) => {
    await loginPage.loginButton.click();

    await expect(loginPage.requiredMessages).toHaveCount(2);
    await expect(loginPage.requiredMessages.nth(0)).toHaveText('Required');
    await expect(loginPage.requiredMessages.nth(1)).toHaveText('Required');
    await loginPage.expectOnLoginPage();
  });

  test('TC_002 - protected page redirects to login when not authenticated', async ({ page, loginPage }) => {
    await page.goto('/web/index.php/dashboard/index');

    await loginPage.expectOnLoginPage();
  });
});
