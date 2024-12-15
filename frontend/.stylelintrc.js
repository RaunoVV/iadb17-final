/** @type {import('stylelint').Config} */
export default {
    $schema: "http://json.schemastore.org/stylelintrc",
    extends: ["stylelint-config-standard"],

    ignoreFiles: ["src/**/*.gen.css"],

    rules: {
        ///// Disabling rules
        "selector-class-pattern": null,
        "declaration-empty-line-before": null,
        "rule-empty-line-before": null,
        "comment-empty-line-before": null,
        "no-descending-specificity": null,
        "import-notation": null,

        ///// Warnings
        "shorthand-property-no-redundant-values": [true, {severity: "warning"}],
        "block-no-empty": [true, {severity: "warning"}],

        ///// Custom configs
        "value-keyword-case": [
            "lower",
            {
                ignoreKeywords: ["currentColor"],
            },
        ],
        "declaration-block-no-redundant-longhand-properties": [
            true,
            {
                ignoreShorthands: [/^place-/, /^grid-template/],
                severity: "warning",
            },
        ],
        "property-no-vendor-prefix": [
            true,
            {
                ignoreProperties: [],
            },
        ],
        "selector-pseudo-class-no-unknown": [
            true,
            {
                ignorePseudoClasses: ["global", "export"],
            },
        ],

        ///// Enabling non-standard rules
        // Add an ignore comment with an explanation if you need to use !important
        "declaration-no-important": true,
    },

    reportDescriptionlessDisables: [
        true,
        {
            except: "no-descending-specificity",
        },
    ],
    reportInvalidScopeDisables: true,
};
