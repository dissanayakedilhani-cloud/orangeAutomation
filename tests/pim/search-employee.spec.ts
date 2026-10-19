import { test, expect } from '../../fixtures/test-fixtures';
import { newEmployee } from '../../utils/data-generator';

// Test case spec: docs/test-cases/critical-regression-test-cases.md#TC_004
test.describe('PIM', () => {
  test('TC_004 - Search an existing employee @critical', async ({ loggedIn, addEmployeePage, employeeListPage }) => {
    // Setup: create our own employee so the test does not depend on TC_003 or shared demo data
    const employee = newEmployee();
    await addEmployeePage.create(employee);

    await test.step('Search by Employee Id', async () => {
      await employeeListPage.goto();
      await employeeListPage.searchById(employee.employeeId);

      await expect(employeeListPage.recordsLabel).toHaveText('(1) Record Found');
      const row = employeeListPage.row(employee.employeeId);
      await expect(row).toContainText(employee.firstName);
      await expect(row).toContainText(employee.lastName);
    });

    await test.step('Search by Employee Name', async () => {
      await employeeListPage.reset();
      await employeeListPage.searchByName(employee.lastName);

      await expect(employeeListPage.row(employee.lastName)).toHaveCount(1);
    });

    await test.step('Search with a non-existent Employee Id', async () => {
      await employeeListPage.reset();
      await employeeListPage.searchById('NOPE99999');

      await expect(employeeListPage.recordsLabel).toHaveText('No Records Found');
      await expect(employeeListPage.rows).toHaveCount(0);
    });
  });
});
