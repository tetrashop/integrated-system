export default {
    testEnvironment: 'jsdom',
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    moduleNameMapping: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
};
