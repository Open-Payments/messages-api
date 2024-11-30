import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
export default [
	{ ignores: ["dist"] },
	{
		files: ["src/**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
				project: "./tsconfig.json",
			},
		},
		settings: {
			react: { version: "18.3" },
			"import/resolver": {
				typescript: {},
			},
		},
		plugins: {
			react,
			"@typescript-eslint": typescript,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...js.configs.recommended.rules,
			...typescript.configs.recommended.rules,
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,
			"react/jsx-no-target-blank": "off",
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
			"eol-last": ["error", "never"],
			"no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
		},
	},
];
