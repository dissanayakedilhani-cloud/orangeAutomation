import { expect, type Locator, type Page } from '@playwright/test';
import type { Employee } from './AddEmployeePage';

export class PersonalDetailsPage {
  readonly employeeName: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;

  constructor(readonly page: Page) {
    this.employeeName = page.locator('.orangehrm-edit-employee-name h6');
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
  }

  async expectEmployee(employee: Employee) {
    await expect(this.employeeName).toHaveText(`${employee.firstName} ${employee.lastName}`, { timeout: 20_000 });
    await expect(this.firstName).toHaveValue(employee.firstName);
    await expect(this.lastName).toHaveValue(employee.lastName);
  }
}
