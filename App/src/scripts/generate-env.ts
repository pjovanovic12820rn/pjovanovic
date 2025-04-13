const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


// Load .env.local contents into process.env
dotenv.config({
  path: path.resolve(__dirname, '../../.env.local'),
});

// Path to your Angular environment file
const targetPath = path.resolve(__dirname, '../environments/environment.ts');

// Build the file content based on .env.local variables
const fileContent = `
// AUTO-GENERATED FILE. DO NOT EDIT.

export const environment = {
  production: true,
  userUrl: '${process.env['USER_URL'] ?? ''}',
  emailUrl: '${process.env['EMAIL_URL'] ?? ''}',
  bankUrl: '${process.env['BANK_URL'] ?? ''}',
  stockUrl: '${process.env['STOCK_URL'] ?? ''}',
};
`;

// Write to environment.ts
fs.writeFileSync(targetPath, fileContent, { encoding: 'utf8' });

console.log(`\nGenerated environment.ts at: ${targetPath}\n`);
console.log(`Using these environment variables:
  USER_URL=${process.env['USER_URL']}
  EMAIL_URL=${process.env['EMAIL_URL']}
  BANK_URL=${process.env['BANK_URL']}
  STOCK_URL=${process.env['STOCK_URL']}
`);
