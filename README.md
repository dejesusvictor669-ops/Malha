# Malha — roteirização de cargas (projeto acadêmico)

## O que tem no projeto
- `index.html` — site completo (landing, cadastro de carga, rastreamento simulado, assistente de IA, área admin), sem framework, dados em `localStorage`.
- `api/chat.js` — function serverless que chama a API da Anthropic, mantendo a chave fora do navegador.

## Deploy na Vercel
1. Crie um repositório com esses dois arquivos/pastas (`index.html` na raiz, `api/chat.js`).
2. Importe o repositório na Vercel (vercel.com → New Project).
3. Em **Settings → Environment Variables**, adicione `ANTHROPIC_API_KEY` com sua chave.
4. Deploy. O site abre em `/` e o chat chama `/api/chat` automaticamente.

## O que é real vs. simulado (importante pra apresentação)
- **Real:** o chat com IA (chama a API de verdade via function serverless).
- **Simulado:** posição dos caminhões (não há GPS real), separação de carga (regra simples de capacidade, não é um otimizador de rotas), vias interditadas (não incluído — não há fonte de dado confiável pra isso na demo).
- Deixe isso claro na apresentação: o valor demonstrado é o **fluxo do produto**, não uma engine de otimização de produção.

## Login admin (demo)
Senha: `malha2026` — só pra fins de demonstração, sem autenticação real.

## Próximos passos possíveis (se sobrar tempo)
- Trocar a separação por regra simples por uma leitura de "quantas entregas cabem por lote" mais refinada.
- Guardar histórico de cargas cadastradas (hoje só conta o total do dia).
