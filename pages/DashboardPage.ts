import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly header: Locator;
  readonly sideMenu: Locator;
  readonly userDropdown: Locator;
  readonly logoutItem: Locator;

  constructor(readonly page: Page) {
    this.header = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.sideMenu = page.locator('.oxd-main-menu');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard\/index/);
    await expect(this.header).toHaveText('Dashboard');
    await expect(this.userDropdown).toBeVisible();
  }

  menuItem(name: string): Locator {
    return this.sideMenu.getByRole('link', { name, exact: true });
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutItem.click();
  }
}
