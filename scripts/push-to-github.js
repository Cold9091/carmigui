import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function main() {
  try {
    console.log('🔄 Conectando ao GitHub...');
    const octokit = await getGitHubClient();

    // Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`✅ Conectado como: ${user.login}`);

    // Check if repo exists
    const repoName = 'carmigui-platform';
    let repoExists = false;
    
    try {
      await octokit.rest.repos.get({
        owner: user.login,
        repo: repoName,
      });
      repoExists = true;
      console.log(`📦 Repositório '${repoName}' já existe`);
    } catch (error) {
      if (error.status === 404) {
        console.log(`📦 Criando repositório '${repoName}'...`);
        await octokit.rest.repos.createForAuthenticatedUser({
          name: repoName,
          description: 'Plataforma imobiliária CARMIGUI para o mercado angolano - Especializada em listagens de imóveis e projetos de construção',
          private: false,
          auto_init: false,
        });
        console.log('✅ Repositório criado com sucesso!');
      } else {
        throw error;
      }
    }

    // Get access token for git operations
    const accessToken = await getAccessToken();
    const remoteUrl = `https://${accessToken}@github.com/${user.login}/${repoName}.git`;

    console.log('\n🔧 Configurando Git...');
    
    // Configure git
    execSync('git config user.email "carmiguicomercialda@gmail.com"', { stdio: 'inherit' });
    execSync('git config user.name "CARMIGUI Platform"', { stdio: 'inherit' });

    // Check if we have commits
    let hasCommits = false;
    try {
      execSync('git rev-parse HEAD', { stdio: 'pipe' });
      hasCommits = true;
    } catch (e) {
      console.log('📝 Nenhum commit encontrado, criando commit inicial...');
    }

    // Add all files if no commits
    if (!hasCommits) {
      console.log('📝 Adicionando arquivos ao Git...');
      execSync('git add -A', { stdio: 'inherit' });
      execSync('git commit -m "feat: initial commit - CARMIGUI platform complete with admin panel, SEO, and production docs"', { stdio: 'inherit' });
    }

    // Check current branch
    let currentBranch = 'main';
    try {
      currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
      console.log(`📍 Branch atual: ${currentBranch}`);
    } catch (e) {
      console.log('📍 Criando branch main...');
      execSync('git branch -M main', { stdio: 'inherit' });
      currentBranch = 'main';
    }

    // Remove existing remote if exists
    try {
      execSync('git remote remove origin', { stdio: 'pipe' });
    } catch (e) {
      // Remote doesn't exist, that's fine
    }

    // Add remote
    console.log('\n🔗 Adicionando remote do GitHub...');
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });

    // Push to GitHub
    console.log(`\n🚀 Enviando código para GitHub...`);
    if (repoExists) {
      // If repo exists, try to pull first to avoid conflicts
      try {
        execSync(`git pull origin ${currentBranch} --rebase`, { stdio: 'inherit' });
      } catch (e) {
        console.log('⚠️  Aviso: Não foi possível fazer pull, forçando push...');
      }
    }
    
    execSync(`git push -u origin ${currentBranch}`, { stdio: 'inherit' });

    console.log('\n✅ Código enviado com sucesso para o GitHub!');
    console.log(`\n🔗 URL do repositório: https://github.com/${user.login}/${repoName}`);
    console.log(`\n📝 Próximos passos:`);
    console.log(`   1. Acesse: https://github.com/${user.login}/${repoName}`);
    console.log(`   2. Configure secrets para deploy (se necessário)`);
    console.log(`   3. Configure GitHub Actions (opcional)`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.response) {
      console.error('Detalhes:', error.response.data);
    }
    process.exit(1);
  }
}

main();
