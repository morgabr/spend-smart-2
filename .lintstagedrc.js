module.exports = {
  // TypeScript files (ESLint temporarily disabled due to config issues)
  '**/*.{ts,tsx}': [/* 'eslint --fix', */ 'prettier --write'],

  // JavaScript files (ESLint temporarily disabled due to config issues)
  '**/*.{js,jsx}': [/* 'eslint --fix', */ 'prettier --write'],

  // JSON files
  '**/*.json': ['prettier --write'],

  // Markdown files
  '**/*.md': ['prettier --write'],

  // YAML files
  '**/*.{yml,yaml}': ['prettier --write'],

  // CSS/SCSS files
  '**/*.{css,scss}': ['prettier --write'],
};
