module.exports = {
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {},
    },
    env: {
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    rules: {
        /**
         * Relaxing overly strict recommended
         */

        // warn about console statements
        'no-console': 'warn',


        /**
         * Best Practices
         */

        // require the use of === and !==
        eqeqeq: 'error',

        // disallow the use of variables before they are defined
        'no-use-before-define': 'error',

        // require let or const instead of var
        'no-var': 'error',

        // require constructor names to begin with a capital letter
        'new-cap': 'warn',

        // require return statements to either always or never specify values
        'consistent-return': 'warn',

        // disallow this keywords outside of classes or class-like objects
        'no-invalid-this': 'error',

        // disallow unmodified conditions of loops
        'no-unmodified-loop-condition': 'warn',

        // disallow unused expressions
        'no-unused-expressions': 'error',

        // disallow unused variables
        'no-unused-vars': ['warn', {
            'argsIgnorePattern': '^_'
        }],

        // disallow redundant return statements
        'no-useless-return': 'error',

        // require const declarations for variables that are never reassigned after declared
        'prefer-const': 'error',


        /**
         * Styling
         */

        // enforce consistent indentation
        indent: ['warn', 2, {
            'SwitchCase': 1
        }],

        // require or disallow trailing commas
        //'comma-dangle': ['error', 'always-multiline'],

        // require or disallow newline at the end of files
        'eol-last': ['error', 'always'],

        // enforce consistent linebreak style
        'linebreak-style': ['error', 'unix'],

        // disallow trailing whitespace at the end of lines
        'no-trailing-spaces': 'error',

        // require parens in arrow function arguments
        'arrow-parens': ['warn', 'as-needed', {
            'requireForBlockBody': true
        }],

        // enforce consistent spacing before blocks
        'space-before-blocks': ['warn', 'always'],

        // enforce consistent spacing before function definition opening parenthesis
        'space-before-function-paren': ['warn', 'never'],

        // enforce consistent spacing before and after keywords
        'keyword-spacing': [
            'warn',
            {
                before: true, // requires at least one space before keywords
                after: true, // requires at least one space after keywords
            },
        ],

        // enforce consistent spacing around commas
        'comma-spacing': 'warn',

        // enforce single quotes everywhere possible
        'quotes': ['warn', 'single'],

        // enforce standard key spacing in object literals
        'key-spacing': 'warn',

        // enforce consistent spacing within parentheses
        'space-in-parens': 'warn',

        // enforce no spacing in array brackets
        'array-bracket-spacing': 'warn',

        // enforce consistent line breaks within array brackets
        'array-bracket-newline': ['warn', 'consistent'],

        // enforce no spacing in curly brackets
        'object-curly-spacing': 'warn',

        // enforce consistent line breaks within function parenthesis
        'function-paren-newline': ['warn', 'consistent'],

        // enforce brace style
        'brace-style': ['warn', 'stroustrup', {
            'allowSingleLine': false
        }],

        // disallow multiple spaces
        'no-multi-spaces': [
            'warn',
            {
                ignoreEOLComments: true,
                exceptions: {
                    VariableDeclarator: true,
                    Property: true,
                },
            },
        ],

        // enforce max length
        'max-len': ['warn', {
            code: 100
        }],

        // enforce consistent newlines within objects
        'object-curly-newline': ['warn', {
            multiline: true,
            consistent: true,
        }],

        // enforce consistent spacing around infix operators
        'space-infix-ops': 'error',

        // require curly braces for control statements
        'curly': 'error',
    },
}