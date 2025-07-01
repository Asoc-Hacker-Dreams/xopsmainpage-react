// eslint.config.js

import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginSecurity from "eslint-plugin-security";

export default [
  // 1. Configuraciones base que SÍ funcionan
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  
  // 2. Objeto de configuración principal
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks, // Se registra el plugin
      'react-refresh': pluginReactRefresh,
      'security': pluginSecurity,
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    // 3. SECCIÓN DE REGLAS CORREGIDA
    rules: {
      // AÑADIMOS MANUALMENTE LAS REGLAS RECOMENDADAS PARA REACT HOOKS
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Tus reglas de seguridad (estas ya estaban bien)
      "security/detect-object-injection": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-pseudoRandomBytes": "error",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-no-csrf-before-method-override": "error",
      
      // Tus otras reglas (estas ya estaban bien)
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { "allowConstantExport": true }
      ],
      
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-unused-vars": "warn",
      "no-console": "warn",
      "eqeqeq": "error",
      "strict": ["error", "global"],
      "semi": ["error", "always"]
    },
  },

  // 4. Patrones a ignorar
  {
    ignores: ["dist/", "node_modules/", "*.min.js"],
  }
];