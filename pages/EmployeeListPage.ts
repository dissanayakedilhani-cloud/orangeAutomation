import { expect, type Locator, type Page } from '@playwright/test';

export class EmployeeListPage {
  readonly employeeName: Locator;
  readonly employeeId: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly addButton: Locator;
  readonly recordsLabel: Locator;
  readonly rows: Locator;
  readonly spinner: Locator;

  constructor(readonly page: Page) {
    this.employeeName = page.locator('.oxd-input-group', { hasText: 'Employee Name' }).locator('input');
    this.employeeId = page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.recordsLabel = page.locator('.orangehrm-horizontal-padding > span');
    this.rows = page.locator('.oxd-table-body .oxd-table-card');
    this.spinner = page.locator('.oxd-loading-spinner');
  }

  async goto() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(this.searchButton).toBeVisible();
  }

  async search() {
    await this.searchButton.click();
    await expect(this.spinner).toHaveCount(0, { timeout: 20_000 });
  }

  async searchById(id: string) {
    await this.employeeId.fill(id);
    await this.search();
  }

  /** Employee Name is an autocomplete: type, then pick the matching suggestion. */
  async searchByName(name: string) {
    await this.employeeName.fill(name);
    await this.page.locator('.oxd-autocomplete-option', { hasText: name }).first().click();
    await this.search();
  }

  async reset() {
    await this.resetButton.click();
    await expect(this.spinner).toHaveCount(0, { timeout: 20_000 });
  }

  row(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  async deleteEmployee(rowText: string) {
    await this.row(rowText).locator('.bi-trash').click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await expect(this.page.locator('.oxd-toast', { hasText: 'Successfully Deleted' })).toBeVisible();
    await expect(this.spinner).toHaveCount(0, { timeout: 20_000 });
  }
}
