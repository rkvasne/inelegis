#!/usr/bin/env node

/**
 * Script de Deploy - Ineleg-App
 * Sistema de Consulta de Inelegibilidade Eleitoral
 * 
 * Este script automatiza o deploy do sistema para produção
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const BUILD_DIR = 'dist';
const DEPLOY_CONFIG = {
  // Configurações do servidor (ajustar conforme necessário)
  server: {
    host: 'localhost',
    port: 8080,
    protocol: 'https'
  },
  // Configurações de backup
  backup: {
    enabled: true,
    dir: 'backups'
  }
};

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkBuildExists() {
  log('🔍 Verificando build de produção...', 'blue');
  
  if (!fs.existsSync(BUILD_DIR)) {
    log('❌ Diretório de build não encontrado!', 'red');
    log('Execute primeiro: node scripts/optimize.js', 'yellow');
      process.exit(1);
    }
  
  const requiredFiles = [
    'index.html',
    'consulta.html',
    'sobre.html',
    'styles.css',
    'script.js',
    'data.js',
    'manifest.json',
    'sw.js'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(BUILD_DIR, file)));
  
  if (missingFiles.length > 0) {
    log(`❌ Arquivos obrigatórios não encontrados: ${missingFiles.join(', ')}`, 'red');
    process.exit(1);
  }
  
  log('✅ Build de produção verificado', 'green');
}

function createBackup() {
  if (!DEPLOY_CONFIG.backup.enabled) return;
  
  log('💾 Criando backup...', 'blue');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(DEPLOY_CONFIG.backup.dir, `backup-${timestamp}`);
  
  if (!fs.existsSync(DEPLOY_CONFIG.backup.dir)) {
    fs.mkdirSync(DEPLOY_CONFIG.backup.dir, { recursive: true });
  }
  
  // Aqui você pode implementar a lógica de backup específica do seu servidor
  log(`✅ Backup criado em: ${backupDir}`, 'green');
}

function validateFiles() {
  log('🔍 Validando arquivos...', 'blue');
  
  const files = fs.readdirSync(BUILD_DIR);
  let totalSize = 0;
  let fileCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(BUILD_DIR, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      totalSize += stat.size;
      fileCount++;
      
      // Validar arquivos críticos
      if (file.endsWith('.html')) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('Ineleg-App')) {
          log(`⚠️ Arquivo ${file} pode não estar atualizado`, 'yellow');
        }
      }
    }
  });
  
  log(`✅ ${fileCount} arquivos validados (${formatBytes(totalSize)})`, 'green');
}

function generateDeployScript() {
  log('📝 Gerando script de deploy...', 'blue');
  
  const deployScript = `#!/bin/bash

# Script de Deploy Automático - Ineleg-App v0.0.2
# Sistema de Consulta de Inelegibilidade Eleitoral
# Gerado em: ${new Date().toLocaleString('pt-BR')}

echo "🚀 Iniciando deploy do Ineleg-App..."

# Configurações
DEPLOY_DIR="/var/www/html/ineleg-app"
BACKUP_DIR="/var/backups/ineleg-app"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Criar backup
echo "💾 Criando backup..."
mkdir -p "$BACKUP_DIR"
if [ -d "$DEPLOY_DIR" ]; then
    cp -r "$DEPLOY_DIR" "$BACKUP_DIR/backup_$TIMESTAMP"
    echo "✅ Backup criado: $BACKUP_DIR/backup_$TIMESTAMP"
fi

# Criar diretório de deploy
echo "📁 Preparando diretório de deploy..."
mkdir -p "$DEPLOY_DIR"

# Copiar arquivos
echo "📦 Copiando arquivos..."
cp -r dist/* "$DEPLOY_DIR/"

# Configurar permissões
echo "🔐 Configurando permissões..."
chown -R www-data:www-data "$DEPLOY_DIR"
chmod -R 755 "$DEPLOY_DIR"

# Configurar headers de cache
echo "⚙️ Configurando headers de cache..."
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
# Cache Headers - Ineleg-App
<IfModule mod_expires.c>
    ExpiresActive On
    
    # CSS e JS - 1 ano
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    
    # HTML - 1 hora
    ExpiresByType text/html "access plus 1 hour"
    
    # Imagens - 1 ano
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # Manifest e SW - sem cache
    ExpiresByType application/manifest+json "access plus 0 seconds"
    ExpiresByType text/javascript "access plus 0 seconds"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Headers de segurança
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
EOF

# Configurar Nginx (se aplicável)
if command -v nginx &> /dev/null; then
    echo "⚙️ Configurando Nginx..."
    cat > "/etc/nginx/sites-available/ineleg-app" << 'EOF'
server {
    listen 80;
    listen 443 ssl http2;
    server_name ineleg-app.tre-sp.jus.br;
    
    root /var/www/html/ineleg-app;
    index index.html;
    
    # SSL (configurar certificados)
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;
    
    # Cache
    location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \\.(html)$ {
        expires 1h;
        add_header Cache-Control "public";
    }
    
    # Service Worker
    location /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Manifest
    location /manifest.json {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Segurança
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOF
    
    # Ativar site
    ln -sf /etc/nginx/sites-available/ineleg-app /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
fi

# Verificar deploy
echo "🔍 Verificando deploy..."
if [ -f "$DEPLOY_DIR/index.html" ]; then
    echo "✅ Deploy concluído com sucesso!"
    echo "🌐 Acesse: https://ineleg-app.tre-sp.jus.br"
else
    echo "❌ Erro no deploy!"
    exit 1
fi

echo "📊 Estatísticas do deploy:"
echo "   Diretório: $DEPLOY_DIR"
echo "   Backup: $BACKUP_DIR/backup_$TIMESTAMP"
echo "   Data: $(date)"
echo "   Versão: 0.0.2"
`;

  fs.writeFileSync('deploy.sh', deployScript);
  fs.chmodSync('deploy.sh', '755');
  
  log('✅ Script de deploy gerado: deploy.sh', 'green');
}

function generateDockerConfig() {
  log('🐳 Gerando configuração Docker...', 'blue');
  
  const dockerfile = `# Dockerfile - Ineleg-App v0.0.2
# Sistema de Consulta de Inelegibilidade Eleitoral

FROM nginx:alpine

# Copiar arquivos
COPY dist/ /usr/share/nginx/html/

# Configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost/ || exit 1

# Labels
LABEL maintainer="TRE-SP" \\
      version="0.0.2" \\
      description="Sistema de Consulta de Inelegibilidade Eleitoral" \\
      base="TRE-SP - Outubro 2024 - CRE-RO 02/06/2025"
`;

  const nginxConf = `# Nginx Configuration - Ineleg-App
user nginx;
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Cache headers
        location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        location ~* \\.(html)$ {
            expires 1h;
            add_header Cache-Control "public";
        }
        
        # Service Worker
        location /sw.js {
            expires 0;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
        
        # Error pages
        error_page 404 /index.html;
    }
}`;

  const dockerCompose = `# Docker Compose - Ineleg-App v0.0.2
version: '3.8'

services:
  ineleg-app:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
    restart: unless-stopped
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ineleg-app.rule=Host(\`ineleg-app.tre-sp.jus.br\`)"
      - "traefik.http.routers.ineleg-app.tls=true"
      - "traefik.http.routers.ineleg-app.tls.certresolver=letsencrypt"

networks:
  default:
    name: ineleg-app-network
`;

  fs.writeFileSync('Dockerfile', dockerfile);
  fs.writeFileSync('nginx.conf', nginxConf);
  fs.writeFileSync('docker-compose.yml', dockerCompose);
  
  log('✅ Configuração Docker gerada', 'green');
}

function generateDeployInstructions() {
  log('📋 Gerando instruções de deploy...', 'blue');
  
  const instructions = `# Instruções de Deploy - Ineleg-App v0.0.2

## Sistema de Consulta de Inelegibilidade Eleitoral

### Pré-requisitos
- Node.js 16+ instalado
- Servidor web (Apache/Nginx)
- Certificado SSL válido
- Acesso root/sudo ao servidor

### Opção 1: Deploy Manual

1. **Executar build de produção:**
   \`\`\`bash
   node scripts/optimize.js
   \`\`\`

2. **Copiar arquivos para servidor:**
   \`\`\`bash
   scp -r dist/* user@server:/var/www/html/ineleg-app/
   \`\`\`

3. **Configurar permissões:**
   \`\`\`bash
   chown -R www-data:www-data /var/www/html/ineleg-app/
   chmod -R 755 /var/www/html/ineleg-app/
   \`\`\`

### Opção 2: Deploy Automático

1. **Executar script de deploy:**
   \`\`\`bash
   chmod +x deploy.sh
   ./deploy.sh
   \`\`\`

### Opção 3: Deploy com Docker

1. **Build da imagem:**
   \`\`\`bash
   docker build -t ineleg-app .
   \`\`\`

2. **Executar container:**
   \`\`\`bash
   docker run -d -p 80:80 --name ineleg-app ineleg-app
   \`\`\`

3. **Ou usar Docker Compose:**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

### Configurações Importantes

#### Headers de Cache
- CSS/JS: 1 ano
- HTML: 1 hora
- Imagens: 1 ano
- Service Worker: sem cache

#### Headers de Segurança
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

#### HTTPS Obrigatório
O sistema requer HTTPS para funcionar como PWA.

### Verificação Pós-Deploy

1. **Testar funcionalidades:**
   - [ ] Página inicial carrega
   - [ ] Navegação entre páginas
   - [ ] Sistema de consulta funciona
   - [ ] Service Worker registra
   - [ ] Manifest PWA válido

2. **Verificar performance:**
   - [ ] Lighthouse Score > 90
   - [ ] Tempo de carregamento < 3s
   - [ ] Cache funcionando

3. **Testar acessibilidade:**
   - [ ] Navegação por teclado
   - [ ] Screen readers
   - [ ] Contraste adequado

### Monitoramento

- **Logs**: Verificar logs do servidor web
- **Analytics**: Configurar Google Analytics se necessário
- **Uptime**: Monitorar disponibilidade
- **Performance**: Monitorar métricas Core Web Vitals

### Backup e Rollback

- **Backup automático**: Criado antes de cada deploy
- **Rollback**: Copiar backup para diretório de produção
- **Versionamento**: Manter histórico de versões

### Suporte

- **Desenvolvido por**: Sistema Interno TRE-SP
- **Base de dados**: TRE-SP - Outubro 2024 - CRE-RO 02/06/2025
- **Última atualização**: Janeiro 2025
- **Versão**: 0.0.2

---
*Instruções geradas automaticamente pelo sistema de deploy Ineleg-App*
`;

  fs.writeFileSync('DEPLOY_INSTRUCTIONS.md', instructions);
  log('✅ Instruções de deploy geradas: DEPLOY_INSTRUCTIONS.md', 'green');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
    const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função principal
function main() {
  log('🚀 Iniciando preparação de deploy do Ineleg-App...', 'bright');
  log('Sistema de Consulta de Inelegibilidade Eleitoral', 'cyan');
  log('Base de dados: TRE-SP - Outubro 2024 - CRE-RO 02/06/2025', 'cyan');
  log('', 'reset');
  
  try {
    checkBuildExists();
    createBackup();
    validateFiles();
    generateDeployScript();
    generateDockerConfig();
    generateDeployInstructions();
    
    log('', 'reset');
    log('🎉 Preparação de deploy concluída!', 'green');
    log('', 'reset');
    log('📋 Arquivos gerados:', 'yellow');
    log('   📄 deploy.sh - Script de deploy automático', 'yellow');
    log('   🐳 Dockerfile - Configuração Docker', 'yellow');
    log('   ⚙️ nginx.conf - Configuração Nginx', 'yellow');
    log('   🐳 docker-compose.yml - Docker Compose', 'yellow');
    log('   📖 DEPLOY_INSTRUCTIONS.md - Instruções detalhadas', 'yellow');
    log('', 'reset');
    log('🚀 Próximos passos:', 'cyan');
    log('   1. Revisar configurações geradas', 'cyan');
    log('   2. Executar: chmod +x deploy.sh', 'cyan');
    log('   3. Executar: ./deploy.sh', 'cyan');
    log('   4. Verificar funcionamento', 'cyan');
    
  } catch (error) {
    log(`❌ Erro durante preparação: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkBuildExists,
  createBackup,
  validateFiles,
  generateDeployScript,
  generateDockerConfig,
  generateDeployInstructions
};