// api/chat.js
// Function serverless da Vercel — roda no servidor, então a chave da API
// nunca é exposta no navegador do usuário.
//
// Configuração necessária na Vercel:
//   Settings > Environment Variables > ANTHROPIC_API_KEY = <sua chave>

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem inválida' });
  }

  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada' });
  }

  const systemPrompt = `Você é o assistente de roteirização da Malha, uma empresa de logística
que atua na Região Metropolitana de Belo Horizonte. Quando o usuário descrever uma carga
(peso, volumetria, região, número de entregas), sugira como dividir a carga em lotes por
caminhão (capacidade de referência: 3.500kg / 18m³ por caminhão) e uma ordem de entrega
sensata. Seja direto e objetivo, em português, em no máximo 5 frases. Não invente dados
de trânsito em tempo real — deixe claro quando uma sugestão é uma estimativa.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro da API Anthropic:', errText);
      // DEBUG TEMPORÁRIO
      return res.status(502).json({
        error: 'Erro ao consultar a IA',
        details: errText || '(corpo vazio)',
        status: response.status,
        contentType: response.headers.get('content-type') || '(sem content-type)',
        keyLength: apiKey.length
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Não consegui gerar uma sugestão agora.';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno', details: String(err) });
  }
}
