module.exports = () => ({
  files: [
    '*.ts',
    '!tests.ts'
  ],
  tests: [
    'tests.ts'
  ],
  env: {
    type: 'node',
  },
});