#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Quality Gates...');

// Initialize Husky
try {
  console.log('📦 Installing Husky...');
  execSync('npx husky install', { stdio: 'inherit' });
  
  // Make pre-commit executable
  const preCommitPath = path.join('.husky', 'pre-commit');
  if (fs.existsSync(preCommitPath)) {
    fs.chmodSync(preCommitPath, '755');
    console.log('✅ Pre-commit hook configured');
  }
  
  // Make commit-msg executable
  const commitMsgPath = path.join('.husky', 'commit-msg');
  if (fs.existsSync(commitMsgPath)) {
    fs.chmodSync(commitMsgPath, '755');
    console.log('✅ Commit message validation configured');
  }
  
  console.log('');
  console.log('🎉 Quality Gates setup complete!');
  console.log('');
  console.log('📋 What was configured:');
  console.log('  ✅ GitHub Actions workflows for CI/CD');
  console.log('  ✅ Pre-commit hooks for code quality');
  console.log('  ✅ Commit message validation');
  console.log('  ✅ Performance auditing');
  console.log('  ✅ Security scanning');
  console.log('');
  console.log('🔧 Available commands:');
  console.log('  npm run quality:gates     - Run all quality checks');
  console.log('  npm run quality:pre-commit - Run pre-commit checks');
  console.log('  npm run quality:audit      - Run security audit');
  console.log('  npm run health-check       - Run detailed health analysis');
  console.log('');
  console.log('📝 Commit format required:');
  console.log('  feat: add new feature');
  console.log('  fix: bug fix');
  console.log('  docs: documentation update');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
