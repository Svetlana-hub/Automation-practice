module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier"
      ],
      "plugins": ["@typescript-eslint", "prettier"],
      "rules": {
        "prettier/prettier": [
          "error",
          {
            "singleQuote": true,
            "semi": false,
            "semi-style": ["error", "last"]
          }
        ],
        "@typescript-eslint/no-unused-vars": ["error"]
      },
      "parser": "@typescript-eslint/parser"
}
