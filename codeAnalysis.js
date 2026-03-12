import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 ANÁLISE REAL DE CÓDIGO - MISSÃO CHINA HQ');
console.log('='.repeat(50));

// 1. Build Status
console.log('\n🏗️  TESTE DE BUILD...');
try {
  const startTime = Date.now();
  execSync('npm run build', { stdio: 'pipe' });
  const buildTime = Date.now() - startTime;
  console.log(`✅ Build: SUCESSO (${buildTime}ms)`);
} catch (error) {
  console.log('❌ Build: FALHOU');
  console.log('Erro:', error.message);
}

// 2. TypeScript Check
console.log('\n📝 TESTE TYPESCRIPT...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript: SEM ERROS');
} catch (error) {
  console.log('❌ TypeScript: COM ERROS');
  // Show first error lines
  const output = error.output ? error.output.toString() : error.message;
  const lines = output.split('\n').slice(0, 5);
  lines.forEach(line => {
    if (line.trim()) console.log('   ', line);
  });
}

// 3. Bundle Size
console.log('\n📦 ANÁLISE DE BUNDLE...');
try {
  if (fs.existsSync('dist')) {
    const files = fs.readdirSync('dist', { recursive: true });
    let totalSize = 0;
    
    files.forEach(file => {
      const filePath = path.join('dist', file);
      if (fs.statSync(filePath).isFile()) {
        totalSize += fs.statSync(filePath).size;
      }
    });
    
    console.log(`✅ Bundle Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Show JS files
    const jsFiles = files.filter(f => f.endsWith('.js'));
    console.log(`   JS Files: ${jsFiles.length}`);
    
  } else {
    console.log('❌ Pasta dist não encontrada');
  }
} catch (error) {
  console.log('❌ Erro na análise de bundle');
}

// 4. Code Metrics
console.log('\n📊 MÉTRICAS DE CÓDIGO...');
try {
  const srcFiles = [];
  
  function findFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findFiles(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        srcFiles.push(fullPath);
      }
    });
  }
  
  findFiles('src');
  
  let totalLines = 0;
  srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    totalLines += content.split('\n').length;
  });
  
  console.log(`✅ Arquivos TS/TSX: ${srcFiles.length}`);
  console.log(`✅ Linhas de Código: ${totalLines}`);
  
} catch (error) {
  console.log('❌ Erro no cálculo de métricas');
}

// 5. Dependencies
console.log('\n📚 DEPENDÊNCIAS...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const deps = packageJson.dependencies || {};
  const devDeps = packageJson.devDependencies || {};
  
  console.log(`✅ Dependencies: ${Object.keys(deps).length}`);
  console.log(`✅ DevDependencies: ${Object.keys(devDeps).length}`);
  
  // Show key dependencies
  console.log('   Key deps:', Object.keys(deps).slice(0, 5).join(', '));
  
} catch (error) {
  console.log('❌ Erro na análise de dependências');
}

// 6. Final Score
console.log('\n🎯 RESUMO FINAL');
console.log('='.repeat(50));
console.log('✅ Análise completa - resultados acima');
console.log('📄 Execute: node codeAnalysis.js > relatorio.txt para salvar');

console.log('\n🏆 STATUS: CÓDIGO ANALISADO COM SUCESSO!');
