module.exports = {
    rootDir: '.',
    preset: "ts-jest",
    testEnvironment: "node",
    roots: [
        "<rootDir>/components"
    ],
    verbose: true,
    testRegex: '(.+)\\.test\\.(jsx?|tsx?)$',
    transformIgnorePatterns: [
        "<rootDir>/node_modules/"
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
        "**/*.test.{tsx,jsx,ts}",
        "!**/node_modules/**",
        "!**/vendor/**"
    ],
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: [
        "/node_modules/"
    ]
};