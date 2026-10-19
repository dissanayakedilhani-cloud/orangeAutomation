import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { PersonalDetailsPage } from '../pages/PersonalDetailsPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { SystemUsersPage } from '../pages/SystemUsersPage';
import { adminUser } from '../test-data/users';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  addEmployeePage: AddEmployeePage;
  personalDetailsPage: PersonalDetailsPage;
  employeeListPage: EmployeeListPage;
  systemUsersPage: SystemUsersPage;
  /** Logs in as Admin before the test. Each test gets its own session, so a logout in one test never affects another. */
  loggedIn: void;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  addEmployeePage: async ({ page }, use) => use(new AddEmployeePage(page)),
  personalDetailsPage: async ({ page }, use) => use(new PersonalDetailsPage(page)),
  employeeListPage: async ({ page }, use) => use(new EmployeeListPage(page)),
  systemUsersPage: async ({ page }, use) => use(new SystemUsersPage(page)),
  loggedIn: async ({ loginPage, dashboardPage }, use) => {
    await loginPage.goto();
    await loginPage.login(adminUser.username, adminUser.password);
    await dashboardPage.expectLoaded();
    await use();
  },
});

export { expect } from '@playwright/test';
