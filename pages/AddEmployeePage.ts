import { expect, type Locator, type Page } from '@playwright/test';

export interface Employee {
  firstName: string;
  lastName: string;
  employeeId: string;
}

export class AddEmployeePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly employeeId: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;

  constructor(readonly page: Page) {
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.employeeId = page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successToast = page.locator('.oxd-toast', { hasText: 'Successfully Saved' });
  }

  async goto() {
    await this.page.goto('/web/index.php/pim/addEmployee');
    await this.waitForForm();
  }

  /** The Employee Id is auto-filled asynchronously; wait so our value is not overwritten. */
  async waitForForm() {
    await expect(this.employeeId).not.toHaveValue('');
  }

  async fill(employee: Employee) {
    await this.firstName.fill(employee.firstName);
    await this.lastName.fill(employee.lastName);
    await this.employeeId.fill(employee.employeeId);
  }

  async save() {
    await this.saveButton.click();
    await expect(this.successToast).toBeVisible();
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: 20_000 });
  }

  async create(employee: Employee) {
    await this.goto();
    await this.fill(employee);
    await this.save();
  }
}
