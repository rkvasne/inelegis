#!/bin/bash

# Script de Deploy Automático - Ineleg-App v0.3.0
# Sistema de Consulta de Inelegibilidade Eleitoral
# Gerado em: 24/10/2025, 14:30:29

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
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(html)$ {
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
echo "   Versão: 0.2.0"
