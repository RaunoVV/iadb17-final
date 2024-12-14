// @ts-check
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";

import globals from "globals";
import tsEslint from "typescript-eslint";

const ignorePattern = "^(_|debug|log$|get$|set$)";

/** @type {import("eslint").Linter.Config} */
// TODO: Remove this hack when React support ESLint 9: https://github.com/facebook/react/issues/28313
const reactHooks = {
	plugins: {
		// @ts-expect-error
		"react-hooks": hooksPlugin,
	},
	// @ts-expect-error
	rules: hooksPlugin.configs.recommended.rules,
};

/** @type {import("eslint").Linter.Config[]} */
// @ts-expect-error

/** @type {import("eslint").Linter.Config[]} */
export default [
	{
		ignores: [
			"/dist",
			"/dist-*",
			"/.eslintrc.cjs",
			"*.gen.*",
			"*.exp.*",
			"**/*.exp.*",
			"/*.config.ts",
			"**/S3FileBrowser.tsx",
		],
		// files: ["src/**/*.{ts,tsx}"],
	},

	js.configs.recommended,
	.../** @type {import("eslint").Linter.Config[]} */ (
		tsEslint.configs.recommendedTypeChecked
	),
	.../** @type {import("eslint").Linter.Config[]} */ (
		tsEslint.configs.stylisticTypeChecked
	),
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	reactHooks,
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: {
				...globals.browser,
			},
			parserOptions: {
				project: ["./tsconfig.json"],
				tsconfigRootDir: import.meta.dirname,
			},
		},

		plugins: {
			"react-refresh": refresh,
		},

		settings: {
			react: {
				version: "18",
			},
		},

		rules: {
			/// Typescript ///
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-unsafe-call": "warn",
			"@typescript-eslint/no-inferrable-types": [
				"warn",
				{ ignoreParameters: true },
			],
			"@typescript-eslint/return-await": ["warn", "always"],
			"@typescript-eslint/require-await": "warn",
			// Does not work with custom classes implementing `.toString()`
			"@typescript-eslint/restrict-template-expressions": "off",
			// Not compatible with react-hook-form: [Typescript error with form and handleSubmit](https://github.com/orgs/react-hook-form/discussions/8020)
			"@typescript-eslint/no-misused-promises": "warn",

			/// TypeScript Stylistic ///
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-duplicate-type-constituents": "warn",
			"@typescript-eslint/prefer-nullish-coalescing": [
				"warn",
				{
					ignorePrimitives: { string: true },
					// ignoreMixedLogicalExpressions: true,
				},
			],
			"@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
			"@typescript-eslint/consistent-indexed-object-style": ["warn", "record"],
			"@typescript-eslint/ban-ts-comment": "warn",

			/// General ///
			"prefer-const": "warn",
			"no-inner-declarations": "off",
			eqeqeq: ["error", "smart"],
			"no-useless-escape": "warn",

			/// Unused variables ///
			// "no-unused-vars": ["warn", { argsIgnorePattern: ignorePattern, destructuredArrayIgnorePattern: ignorePattern }],
			"no-unused-vars": "off", // Does not work with TypeScript function types
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: ignorePattern,
					varsIgnorePattern: ignorePattern,
					caughtErrorsIgnorePattern: ignorePattern,
				},
			],

			/// React ///
			"react/prop-types": "off",
			"react/no-unescaped-entities": "off",
			"react/react-in-jsx-scope": "off", // Not necessary with Vite
			"react/no-unknown-property": ["error", { ignore: ["class"] }],
			"react/jsx-no-target-blank": "warn",
			"react/jsx-no-useless-fragment": "warn",
			"react/jsx-fragments": "warn",
			"react/jsx-curly-brace-presence": [
				"warn",
				{ props: "never", children: "never", propElementValues: "always" },
			],
			"react-refresh/only-export-components": ["warn"],
			"react/jsx-key": [
				"warn",
				{
					checkFragmentShorthand: true,
					checkKeyMustBeforeSpread: true,
					warnOnDuplicates: true,
				},
			],
		},
	},
];
