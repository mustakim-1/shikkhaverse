import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      envPrefix: ['VITE_', 'GEMINI_'],
      plugins: [
        react(),
        {
          name: 'gemini-proxy',
          configureServer(server) {
            server.middlewares.use('/api/gemini', async (req, res) => {
              if (req.method !== 'POST') {
                res.statusCode = 405;
                res.end('method not allowed');
                return;
              }
              const apiKey = env.GEMINI_API_KEY || env.VITE_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'API key missing' }));
                return;
              }
              let body = '';
              req.on('data', (chunk) => (body += chunk));
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const history = Array.isArray(parsed.history) ? parsed.history : [];
                  const parts = Array.isArray(parsed.parts) ? parsed.parts : [];
                  const model = typeof parsed.model === 'string' ? parsed.model : 'gemini-1.5-flash';
                  const contents = [
                    ...history.map((h: any) => ({
                      role: h.role,
                      parts: [{ text: h.text }],
                    })),
                    { role: 'user', parts },
                  ];
                  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
                  const r = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents,
                      generationConfig: { maxOutputTokens: 600, temperature: 0.6 },
                    }),
                  });
                  const j = await r.json();
                  if (!r.ok) {
                    res.statusCode = r.status;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        error: j?.error?.message || 'request failed',
                        status: r.status,
                      }),
                    );
                    return;
                  }
                  const text =
                    (j?.candidates?.[0]?.content?.parts || [])
                      .map((p: any) => p.text || '')
                      .join('') || '';
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ text }));
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e?.message || 'unknown error' }));
                }
              });
            });
          },
        },
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
