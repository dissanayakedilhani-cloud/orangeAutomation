import { test, expect } from '../../fixtures/test-fixtures';

// Test case spec: docs/test-cases/critical-regression-test-cases.md#TC_005
test.describe('Authentication', () => {
  test('TC_005 - Logout ends the session @critical @security', async ({ page, loggedIn, dashboardPage, loginPage }) => {
    await dashboardPage.userDropdown.click();
    for (const item of ['About', 'Support', 'Change Password', 'Logout']) {
      await expect(page.getByRole('menuitem', { name: item })).toBeVisible();
    }

    await dashboardPage.logoutItem.click();
    await loginPage.expectOnLoginPage();

    await page.goBack();
    await loginPage.expectOnLoginPage();

    await page.goto('/web/index.php/pim/viewEmployeeList');
    await loginPage.expectOnLoginPage();
  });
});
