module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  transform: {}, // Disable transforms for raw Node.js environment if using CommonJS
};
