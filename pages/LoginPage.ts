import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly requiredMessages: Locator;

  constructor(readonly page: Page) {
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.requiredMessages = page.locator('.oxd-input-field-error-message');
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.username).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await expect(this.loginButton).toBeVisible();
  }
}
