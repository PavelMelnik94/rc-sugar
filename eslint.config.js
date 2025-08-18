import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    typescript: true,
    react: true,
    test: true,
    markdown: false,


    // BIOME OVERRIDES
    stylistic: false,
    formatters: false,
    gitignore: true,
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'build',
      'public',
      'out',
      '*.md'],

    rules: {
      'no-console': 'off',

      'style/semi': 'off',
      'style/quotes': 'off',
      'style/indent': 'off',
      'style/comma-dangle': 'off',

      'ts/no-explicit-any': 'error',
      'ts/no-unused-vars': 'error',
      'ts/consistent-type-definitions': ['error', 'interface'],

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    // BIOME OVERRIDES END

    },

  },
  {
    // Настройки для тестовых файлов
    files: ['**/*.test.*', '**/*.spec.*'],
    rules: {
      'ts/no-explicit-any': 'off',
    },
  }
)
