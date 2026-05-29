import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import path from 'node:path'

const aliasRule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          rootDir: { type: 'string' },
          prefix: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useAlias:
        "Use alias '{{suggested}}' instead of relative path '{{original}}'.",
    },
  },
  create(context) {
    const { rootDir = 'src', prefix = '@' } = context.options[0] ?? {}
    const cwd = context.cwd
    const rootAbs = path.resolve(cwd, rootDir)

    const check = (node) => {
      const source = node.source
      if (!source || typeof source.value !== 'string') return
      const value = source.value
      if (!value.startsWith('../')) return

      const fileDir = path.dirname(context.filename)
      const targetAbs = path.resolve(fileDir, value)
      const rel = path.relative(rootAbs, targetAbs)
      if (rel.startsWith('..') || path.isAbsolute(rel)) return

      const normalized = rel.split(path.sep).join('/')
      const suggested = `${prefix}/${normalized}`

      context.report({
        node: source,
        messageId: 'useAlias',
        data: { suggested, original: value },
        fix: (fixer) => fixer.replaceText(source, `'${suggested}'`),
      })
    }

    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
    }
  },
}

const localPlugin = {
  rules: { 'no-relative-parent-import': aliasRule },
}

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,test.ts}'],
    plugins: {
      import: importPlugin,
      local: localPlugin,
    },
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: true,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'local/no-relative-parent-import': [
        'error',
        { rootDir: 'src', prefix: '@' },
      ],
    },
  },
)
