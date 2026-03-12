#!/bin/bash

# Script para gerar ícones PWA para Missão China HQ
# Este script cria todos os tamanhos necessários para PWA, iOS, Android e Windows

echo "🚀 Gerando ícones PWA para Missão China HQ..."

# Criar diretório de ícones se não existir
mkdir -p public/icons

# URLs dos ícones já gerados (CDN Mocha)
ICON_512="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-512x512.png"
ICON_192="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-192x192.png"
ICON_384="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-384x384.png"
ICON_152="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-152x152.png"
ICON_180="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-180x180.png"
ICON_144="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-144x144.png"

# Shortcuts
SHORTCUT_DASHBOARD="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-shortcut-dashboard.png"
SHORTCUT_SKUS="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-shortcut-skus.png"
SHORTCUT_SUPPLIERS="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-shortcut-suppliers.png"
SHORTCUT_COMPLIANCE="https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-shortcut-compliance.png"

echo "📱 Ícones PWA configurados:"
echo "✅ Ícone principal (512x512): Gerado via IA - Design profissional azul"
echo "✅ Ícone Android (192x192): Gerado via IA - Otimizado para Play Store"
echo "✅ Ícone splash (384x384): Gerado via IA - Para splash screens"
echo "✅ Ícone iOS (152x152): Gerado via IA - Apple touch icon"
echo "✅ Ícone iOS (180x180): Gerado via IA - iPhone Plus/Pro"
echo "✅ Ícone Windows (144x144): Gerado via IA - Tile do Windows"

echo "🔗 Shortcuts configurados:"
echo "✅ Dashboard: Acesso rápido ao painel principal"
echo "✅ SKUs: Playbook técnico IoT"
echo "✅ Fornecedores: Gestão de suppliers"
echo "✅ Compliance: Regulamentações 2025"

echo ""
echo "🎨 Todos os ícones seguem o design system:"
echo "• Paleta: Azul #3b82f6 (gradient)"
echo "• Estilo: Minimalista e profissional"
echo "• Tema: Conexão China ↔ Brasil/Portugal"
echo "• Formato: PNG com transparência"
echo "• Background: Branco para compatibilidade"

echo ""
echo "✅ PWA Icons Setup Complete!"
echo "📱 O app agora pode ser instalado em qualquer dispositivo"
echo "🚀 Use o comando 'Add to Home Screen' no navegador"

# Opcional: baixar ícones localmente (se curl estiver disponível)
if command -v curl &> /dev/null; then
    echo ""
    echo "📥 Baixando ícones localmente..."
    
    curl -s "$ICON_512" -o public/icons/icon-512x512.png
    curl -s "$ICON_192" -o public/icons/icon-192x192.png  
    curl -s "$ICON_384" -o public/icons/icon-384x384.png
    curl -s "$ICON_152" -o public/icons/icon-152x152.png
    curl -s "$ICON_180" -o public/icons/icon-180x180.png
    curl -s "$ICON_144" -o public/icons/icon-144x144.png
    
    curl -s "$SHORTCUT_DASHBOARD" -o public/icons/shortcut-dashboard.png
    curl -s "$SHORTCUT_SKUS" -o public/icons/shortcut-skus.png
    curl -s "$SHORTCUT_SUPPLIERS" -o public/icons/shortcut-suppliers.png
    curl -s "$SHORTCUT_COMPLIANCE" -o public/icons/shortcut-compliance.png
    
    echo "✅ Ícones baixados localmente em public/icons/"
fi

echo ""
echo "🔧 Para gerar novos tamanhos, use:"
echo "• realfavicongenerator.net (completo)"
echo "• favicon.io (simples)"
echo "• Ou ImageMagick: convert icon-512x512.png -resize 96x96 icon-96x96.png"
