import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-console': 'error', // console.log 사용 시 경고
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수에 경고
      'react/prop-types': 'off', // TypeScript를 사용하는 경우 prop-types 필요 없음
      '@typescript-eslint/no-unused-vars': 'warn', // TypeScript에서 사용되지 않는 변수에 경고
    },
  },
]
