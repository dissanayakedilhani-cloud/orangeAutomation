import { test, expect } from '../../fixtures/test-fixtures';
import { newEmployeeWithLogin } from '../../utils/data-generator';

// Test case spec: docs/test-cases/critical-regression-test-cases.md#TC_003
test.describe('PIM', () => {
  test('TC_003 - Add a new employee, disable login, then delete @critical', async ({
    loggedIn, dashboardPage, employeeListPage, addEmployeePage, personalDetailsPage, systemUsersPage,
  }) => {
    // End-to-end flow across PIM and Admin on a shared demo server
    test.slow();
    const employee = newEmployeeWithLogin();
    const username = employee.login!.username;

    await test.step('Add employee with login details (status Enabled)', async () => {
      await dashboardPage.menuItem('PIM').click();
      await expect(employeeListPage.searchButton).toBeVisible();

      await employeeListPage.addButton.click();
      await addEmployeePage.waitForForm();

      await addEmployeePage.fill(employee);
      await addEmployeePage.save();

      await personalDetailsPage.expectEmployee(employee);
    });

    await test.step('Edit login status to Disabled', async () => {
      await systemUsersPage.goto();
      await systemUsersPage.searchByUsername(username);
      await expect(systemUsersPage.row(username)).toContainText('Enabled');

      await systemUsersPage.openEdit(username);
      await systemUsersPage.setStatus('Disabled');
      await systemUsersPage.save();

      await systemUsersPage.searchByUsername(username);
      await expect(systemUsersPage.row(username)).toContainText('Disabled');
    });

    await test.step('Delete the employee', async () => {
      await employeeListPage.goto();
      await employeeListPage.searchById(employee.employeeId);
      await expect(employeeListPage.row(employee.employeeId)).toHaveCount(1);

      await employeeListPage.deleteEmployee(employee.employeeId);

      await employeeListPage.searchById(employee.employeeId);
      await expect(employeeListPage.recordsLabel).toHaveText('No Records Found');
    });
  });
});
