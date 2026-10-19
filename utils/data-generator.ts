import type { Employee } from '../pages/AddEmployeePage';

/** Unique suffix so tests never collide on the shared demo site. */
export const uniqueSuffix = (): string => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

export const newEmployee = (): Employee => {
  const suffix = uniqueSuffix();
  return {
    firstName: 'Auto',
    lastName: `Test${suffix}`,
    // Employee Id field allows max 10 characters
    employeeId: suffix.slice(-10),
  };
};
