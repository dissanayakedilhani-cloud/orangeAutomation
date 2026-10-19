import { expect, type Locator, type Page } from '@playwright/test';

export interface LoginDetails {
  username: string;
  password: string;
  status: 'Enabled' | 'Disabled';
}

export interface Employee {
  firstName: string;
  lastName: string;
  employeeId: string;
  login?: LoginDetails;
}

export class AddEmployeePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly employeeId: Locator;
  readonly createLoginToggle: Locator;
  readonly username: Locator;
  readonly passwords: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;

  constructor(readonly page: Page) {
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.employeeId = page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
    this.createLoginToggle = page.locator('.oxd-switch-input');
    this.username = page.locator('.oxd-input-group', { hasText: 'Username' }).locator('input');
    // [0] = Password, [1] = Confirm Password
    this.passwords = page.locator('input[type="password"]');
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
    if (employee.login) await this.fillLoginDetails(employee.login);
  }

  async fillLoginDetails(login: LoginDetails) {
    await this.createLoginToggle.click();
    await expect(this.username).toBeVisible();
    await this.username.fill(login.username);
    await this.page.locator('.oxd-radio-wrapper', { hasText: login.status }).locator('label').click();
    await this.passwords.nth(0).fill(login.password);
    await this.passwords.nth(1).fill(login.password);
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
