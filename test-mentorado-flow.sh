#!/bin/bash

echo "=== Testando Fluxo Completo do Mentorado Hub ==="
echo ""

# 1. Test login page accessibility
echo "1. Testando acesso à página de login..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173/mentorado/login")
if [ "$STATUS" -eq 200 ]; then
    echo "✅ Página de login acessível (HTTP $STATUS)"
else
    echo "❌ Erro ao acessar página de login (HTTP $STATUS)"
fi
echo ""

# 2. Test send code
echo "2. Testando envio de código..."
SEND_CODE=$(curl -s -X POST http://localhost:5173/api/mentorado-auth/send-code \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@missaochinapro.com"}')
if echo "$SEND_CODE" | grep -q "success"; then
    echo "✅ Código enviado com sucesso"
    echo "   Resposta: $SEND_CODE"
else
    echo "❌ Erro ao enviar código"
fi
echo ""

# 3. Test login
echo "3. Testando login..."
LOGIN=$(curl -s -X POST http://localhost:5173/api/mentorado-auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@missaochinapro.com","code":"123456"}')
if echo "$LOGIN" | grep -q "token"; then
    echo "✅ Login bem-sucedido"
    TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "   Token obtido: ${TOKEN:0:50}..."
else
    echo "❌ Erro no login"
fi
echo ""

# 4. Test dashboard access with token
echo "4. Testando acesso ao dashboard..."
if [ -n "$TOKEN" ]; then
    DASHBOARD=$(curl -s "http://localhost:5173/api/mentorado/dashboard" \
        -H "Authorization: Bearer $TOKEN")
    if echo "$DASHBOARD" | grep -q "success"; then
        echo "✅ Dashboard acessível com token"
        echo "   Deals encontrados: $(echo "$DASHBOARD" | grep -o '"totalDeals":[0-9]*' | cut -d':' -f2)"
        echo "   Investimento total: $(echo "$DASHBOARD" | grep -o '"totalInvestment":[0-9]*' | cut -d':' -f2)"
        echo "   Factories ativas: $(echo "$DASHBOARD" | grep -o '"activeFactories":[0-9]*' | cut -d':' -f2)"
    else
        echo "❌ Erro ao acessar dashboard"
    fi
else
    echo "❌ Token não disponível, pulando teste"
fi
echo ""

echo "=== Teste Completo ==="
