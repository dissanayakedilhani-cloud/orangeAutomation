export const adminUser = {
  username: process.env.ADMIN_USERNAME || 'Admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

export const invalidUsers = [
  { case: 'valid username, wrong password', username: 'Admin', password: 'wrongPass123' },
  { case: 'wrong username, valid password', username: 'invalidUser', password: 'admin123' },
];
