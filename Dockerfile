# Dockerfile - Ineleg-App v0.0.2
# Sistema de Consulta de Inelegibilidade Eleitoral

FROM nginx:alpine

# Copiar arquivos
COPY dist/ /usr/share/nginx/html/

# Configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Labels
LABEL maintainer="TRE-SP" \
      version="0.0.2" \
      description="Sistema de Consulta de Inelegibilidade Eleitoral" \
      base="TRE-SP - Outubro 2024 - CRE-RO 02/06/2025"
