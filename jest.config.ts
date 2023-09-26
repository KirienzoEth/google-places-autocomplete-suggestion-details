export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '<regex_match_files': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFiles: ['dotenv/config'],
};
