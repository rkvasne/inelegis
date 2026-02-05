export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        leisDisponiveis: "readonly",
        tabelaInelegibilidade: "readonly",
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        Headers: "readonly",
        Request: "readonly",
        Response: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
      "no-alert": "warn",
      "no-debugger": "error",
    },
    files: ["src/**/*.js", "public/assets/js/**/*.js"],
  },
];
