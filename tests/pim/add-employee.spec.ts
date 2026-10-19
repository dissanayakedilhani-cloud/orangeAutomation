import { test, expect } from '../../fixtures/test-fixtures';
import { newEmployee } from '../../utils/data-generator';

// Test case spec: docs/test-cases/critical-regression-test-cases.md#TC_003
test.describe('PIM', () => {
  test('TC_003 - Add a new employee @critical', async ({ loggedIn, dashboardPage, employeeListPage, addEmployeePage, personalDetailsPage }) => {
    const employee = newEmployee();

    await dashboardPage.menuItem('PIM').click();
    await expect(employeeListPage.searchButton).toBeVisible();

    await employeeListPage.addButton.click();
    await addEmployeePage.waitForForm();

    await addEmployeePage.fill(employee);
    await addEmployeePage.save();

    await personalDetailsPage.expectEmployee(employee);
  });
});
