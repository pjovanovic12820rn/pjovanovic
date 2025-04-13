const fs1 = require('fs');
const path1 = require('path');

// Path to .env.example (template)
const envExamplePath = path1.resolve(__dirname, '../../.env.example');

// Path to .env.local (destination)
const envLocalPath = path1.resolve(__dirname, '../../.env.local');

// 1) Check if .env.local already exists
if (!fs1.existsSync(envLocalPath)) {
  // 2) If not, copy .env.example to .env.local
  fs1.copyFileSync(envExamplePath, envLocalPath);
  console.log('.env.local not found, created from .env.example');
} else {
  // 3) If yes, skip
  console.log('.env.local already exists, skipping creation...');
}
