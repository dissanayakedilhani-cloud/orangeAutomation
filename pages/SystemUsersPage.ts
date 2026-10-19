import { expect, type Locator, type Page } from '@playwright/test';

/** Admin → User Management → Users (list + Edit User form). */
export class SystemUsersPage {
  readonly usernameFilter: Locator;
  readonly searchButton: Locator;
  readonly rows: Locator;
  readonly spinner: Locator;
  readonly editUsername: Locator;
  readonly statusDropdown: Locator;
  readonly saveButton: Locator;
  readonly updatedToast: Locator;

  constructor(readonly page: Page) {
    this.usernameFilter = page.locator('.oxd-input-group', { hasText: 'Username' }).locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.rows = page.locator('.oxd-table-body .oxd-table-card');
    this.spinner = page.locator('.oxd-loading-spinner');
    this.editUsername = page.locator('.oxd-input-group', { hasText: 'Username' }).locator('input');
    this.statusDropdown = page.locator('.oxd-input-group', { hasText: 'Status' }).locator('.oxd-select-text');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.updatedToast = page.locator('.oxd-toast', { hasText: 'Successfully Updated' });
  }

  async goto() {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
    await expect(this.searchButton).toBeVisible();
  }

  async searchByUsername(username: string) {
    await this.usernameFilter.fill(username);
    await this.searchButton.click();
    await expect(this.spinner).toHaveCount(0, { timeout: 20_000 });
  }

  row(username: string): Locator {
    return this.rows.filter({ hasText: username });
  }

  async openEdit(username: string) {
    await this.row(username).locator('.bi-pencil-fill').click();
    await expect(this.page).toHaveURL(/\/admin\/saveSystemUser\/\d+/);
    // Form data loads asynchronously; wait so our changes are not overwritten
    await expect(this.editUsername).toHaveValue(username, { timeout: 20_000 });
  }

  async setStatus(status: 'Enabled' | 'Disabled') {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
    await expect(this.statusDropdown).toHaveText(status);
  }

  async save() {
    // Saving a user is slow on the demo server; the redirect back to the list confirms success
    await Promise.all([
      expect(this.updatedToast).toBeVisible({ timeout: 45_000 }),
      this.saveButton.click(),
    ]);
    await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/, { timeout: 45_000 });
    await expect(this.searchButton).toBeVisible();
  }
}
