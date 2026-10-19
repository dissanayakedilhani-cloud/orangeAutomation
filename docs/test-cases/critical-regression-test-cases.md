# Critical Regression Test Cases – OrangeHRM

| Item | Value |
|---|---|
| Application | OrangeHRM Open Source Demo |
| URL | https://opensource-demo.orangehrmlive.com/ |
| Test user | Admin / admin123 (role: Admin) |
| Suite | Critical Regression (Smoke + Core Business Flows) |
| Version | 1.0 (2026-10-19) |

## How these 5 were selected

The cases were ranked by **business impact × usage frequency × risk of breaking**:

1. **Authentication is the gateway.** If login fails, nothing else works, so it is always P1.
2. **Security behaviour** (rejecting bad credentials, ending sessions on logout) must never regress.
3. **PIM (Employee management) is the core of an HRM system.** Leave, Time, Performance and Payroll all depend on an employee record existing.
4. Each case is **independent**, **deterministic**, and **creates its own data**. This makes it safe to run on every CI build against a shared demo site.

## Summary

| ID | Title | Module | Type | Priority |
|---|---|---|---|---|
| TC_001 | Login with valid credentials | Auth | Positive / Smoke | P1 – Critical |
| TC_002 | Login with invalid credentials is rejected | Auth | Negative / Security | P1 – Critical |
| TC_003 | Add a new employee | PIM | Positive / Core flow | P1 – Critical |
| TC_004 | Search an existing employee in Employee List | PIM | Positive / Core flow | P1 – Critical |
| TC_005 | Logout ends the session | Auth | Positive / Security | P1 – Critical |

---

## TC_001 – Login with valid credentials

| Field | Detail |
|---|---|
| Module | Authentication |
| Priority | P1 – Critical |
| Preconditions | User is on the login page `/web/index.php/auth/login`. The Admin account is active. |
| Test data | Username: `Admin`, Password: `admin123` |

| # | Step | Expected result |
|---|---|---|
| 1 | Open the application URL | Login page loads with Username, Password fields and a **Login** button |
| 2 | Enter username `Admin` | Value is accepted |
| 3 | Enter password `admin123` | Value is masked |
| 4 | Click **Login** | User is redirected to `/web/index.php/dashboard/index` |
| 5 | Verify the dashboard | Page header shows **Dashboard**. The left side menu (Admin, PIM, Leave, …) and the user profile dropdown are visible |

**Why critical:** This is the entry point to every feature. A failure here blocks 100% of users.

---

## TC_002 – Login with invalid credentials is rejected

| Field | Detail |
|---|---|
| Module | Authentication |
| Priority | P1 – Critical |
| Preconditions | User is on the login page |
| Test data | (a) Username `Admin` / Password `wrongPass123` (b) Username `invalidUser` / Password `admin123` (c) Both fields empty |

| # | Step | Expected result |
|---|---|---|
| 1 | Enter a valid username with a wrong password, then click **Login** | Error alert **"Invalid credentials"** is shown. User stays on the login page |
| 2 | Enter a wrong username with a valid password, then click **Login** | Error alert **"Invalid credentials"** is shown. User stays on the login page |
| 3 | Leave both fields empty and click **Login** | **"Required"** validation message appears under both fields |
| 4 | Try to open `/web/index.php/dashboard/index` directly | User is redirected back to the login page |

**Why critical:** This is a security control. A regression could allow unauthorised access to employee PII.

---

## TC_003 – Add a new employee

| Field | Detail |
|---|---|
| Module | PIM |
| Priority | P1 – Critical |
| Preconditions | Logged in as Admin |
| Test data | First name `Auto`, Last name `Test<timestamp>` (unique on every run). Employee ID is auto-generated |

| # | Step | Expected result |
|---|---|---|
| 1 | Click **PIM** in the side menu | Employee List page is displayed |
| 2 | Click **+ Add** | Add Employee form is displayed with an auto-generated Employee Id |
| 3 | Enter First Name and Last Name | Values are accepted |
| 4 | Note the Employee Id value | Id is non-empty |
| 5 | Click **Save** | Success toast **"Successfully Saved"** appears |
| 6 | Verify the redirect | User lands on the employee's **Personal Details** page (`/pim/viewPersonalDetails/empNumber/<n>`). First and Last name are shown correctly |

**Why critical:** Creating employees is the core HR transaction. Leave, Time, Performance and user accounts all depend on employee records.

---

## TC_004 – Search an existing employee in Employee List

| Field | Detail |
|---|---|
| Module | PIM |
| Priority | P1 – Critical |
| Preconditions | Logged in as Admin. A known employee exists (created in test setup through the UI/API, so the test does not depend on TC_003) |
| Test data | Employee Id and Name of the employee created in setup |

| # | Step | Expected result |
|---|---|---|
| 1 | Go to **PIM → Employee List** | Employee List page with the search panel is displayed |
| 2 | Enter the employee's **Employee Id** and click **Search** | **"(1) Record Found"** is shown. The row shows the matching Id, First (& Middle) Name and Last Name |
| 3 | Click **Reset**, type the employee's name in **Employee Name** and click **Search** | The employee appears in the results |
| 4 | Search with a non-existent Employee Id (e.g. `NOPE99999`) | **"No Records Found"** is shown (toast and/or label) |

**Why critical:** HR staff use search all the time to reach employee records. If search breaks, all employee maintenance is blocked.

---

## TC_005 – Logout ends the session

| Field | Detail |
|---|---|
| Module | Authentication |
| Priority | P1 – Critical |
| Preconditions | Logged in as Admin |
| Test data | – |

| # | Step | Expected result |
|---|---|---|
| 1 | Click the user profile dropdown (top-right) | Menu shows About, Support, Change Password, **Logout** |
| 2 | Click **Logout** | User is redirected to the login page |
| 3 | Press the browser **Back** button | User is NOT returned to the dashboard. The login page is shown |
| 4 | Open `/web/index.php/pim/viewEmployeeList` directly | User is redirected to the login page |

**Why critical:** This is session management security. On shared machines, a broken logout exposes HR data.

---

## Candidates for the next batch (not in the top 5)

| Module | Scenario |
|---|---|
| Admin | Create a System User (ESS role) for an employee, then log in as that user |
| Leave | Assign leave to an employee and verify it in the Leave List |
| PIM | Edit an employee's personal details, and delete an employee |
| Admin | Role-based access: an ESS user cannot see the Admin menu |
| Recruitment | Add a candidate to a vacancy |

## Notes / risks for automation

- The demo site is **public and shared**, and it **resets data periodically**. Tests must create their own data with unique names and must not depend on pre-existing records other than the Admin user.
- Other users may change the Admin password on the demo site. The password is kept in `.env` so it can be changed without touching code.
- Use stable locators (role/label/placeholder). Avoid auto-generated CSS classes.
