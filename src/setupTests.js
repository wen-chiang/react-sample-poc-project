// Jest Setup File
// This file runs before tests to configure the testing environment

// Mock file imports for images, fonts, etc.
jest.mock = {
  '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
};

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities (optional)
global.testUtils = {
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};
