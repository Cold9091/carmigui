#!/usr/bin/env node

/**
 * Script de Monitoramento de Produção
 * Verifica saúde da aplicação em produção
 */

import https from 'https';
import http from 'http';

function normalizeUrl(url) {
  if (!url) return 'http://localhost:5000';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return `https://${url}`;
}

const config = {
  url: normalizeUrl(process.env.BASE_URL || process.env.VERCEL_URL),
  timeout: 10000,
  endpoints: [
    { path: '/', name: 'Homepage' },
    { path: '/api/health', name: 'Health Check API' },
    { path: '/api/properties', name: 'Properties API' },
  ]
};

function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint.path, config.url);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const startTime = Date.now();
    
    const req = protocol.get(url, { timeout: config.timeout }, (res) => {
      const responseTime = Date.now() - startTime;
      const isHealthy = res.statusCode >= 200 && res.statusCode < 400;
      
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: res.statusCode,
        responseTime,
        healthy: isHealthy,
        timestamp: new Date().toISOString()
      });
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 0,
        responseTime,
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 0,
        responseTime: config.timeout,
        healthy: false,
        error: 'Request timeout',
        timestamp: new Date().toISOString()
      });
    });
  });
}

async function monitor() {
  console.log('🔍 CARMIGUI - Monitoramento de Produção\n');
  console.log(`🌐 URL: ${config.url}\n`);
  console.log('━'.repeat(60));
  
  const results = await Promise.all(
    config.endpoints.map(endpoint => checkEndpoint(endpoint))
  );

  let allHealthy = true;
  
  results.forEach(result => {
    const statusIcon = result.healthy ? '✅' : '❌';
    const statusCode = result.status || 'ERR';
    const responseTime = `${result.responseTime}ms`;
    
    console.log(`\n${statusIcon} ${result.name}`);
    console.log(`   Path: ${result.path}`);
    console.log(`   Status: ${statusCode}`);
    console.log(`   Response Time: ${responseTime}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
      allHealthy = false;
    }
    
    if (result.responseTime > 3000) {
      console.log(`   ⚠️  Slow response (>3s)`);
    }
  });
  
  console.log('\n' + '━'.repeat(60));
  
  if (allHealthy) {
    console.log('\n✅ Todos os endpoints estão funcionando\n');
    return 0;
  } else {
    console.log('\n❌ Alguns endpoints apresentam problemas\n');
    return 1;
  }
}

monitor().then(exitCode => process.exit(exitCode));
