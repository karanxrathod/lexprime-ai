import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash';

// Load key from environment or .env.local
let apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const match = line.match(/^VITE_GEMINI_API_KEY=(.*)$/);
      if (match) {
        apiKey = match[1].trim().replace(/^["']|["']$/g, '');
        break;
      }
    }
  }
}

if (!apiKey) {
  console.error('[Gemini Smoke Test] Error: No API key found in environment or .env.local');
  process.exit(1);
}

console.log('[Gemini Smoke Test] API key found (length: ' + apiKey.length + ')');

const ai = new GoogleGenAI({ apiKey });

async function smokeTestModel(modelId, role) {
  process.stdout.write(`[Gemini Smoke Test] Testing ${role} model (${modelId})... `);
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: 'Reply with exactly: OK'
    });
    const text = response.text?.trim() || '';
    if (text.length > 0) {
      console.log(`PASS! Response: "${text}"`);
      return true;
    }
    console.log('FAIL! Empty response received.');
    return false;
  } catch (err) {
    const status = err?.status || err?.code || 'unknown';
    const msg = (err?.message || String(err)).replace(/AIzaSy[A-Za-z0-9_-]{33}/g, '[REDACTED]');
    console.log(`FAIL! (status: ${status}, error: ${msg})`);
    return false;
  }
}

async function main() {
  console.log('=== LexPrime AI: Gemini Smoke Test ===');
  console.log(`Primary Model:  ${PRIMARY_MODEL}`);
  console.log(`Fallback Model: ${FALLBACK_MODEL}`);
  console.log('---------------------------------------');

  const primaryOk = await smokeTestModel(PRIMARY_MODEL, 'PRIMARY');
  const fallbackOk = await smokeTestModel(FALLBACK_MODEL, 'FALLBACK');

  console.log('---------------------------------------');
  console.log(`Results: Primary: ${primaryOk ? 'PASS' : 'FAIL'} | Fallback: ${fallbackOk ? 'PASS' : 'FAIL'}`);

  if (!primaryOk && !fallbackOk) {
    console.error('[Gemini Smoke Test] CRITICAL: Both primary and fallback models failed!');
    process.exit(1);
  }

  console.log('[Gemini Smoke Test] Smoke test verified successfully.');
}

main().catch((err) => {
  console.error('[Gemini Smoke Test] Unexpected error:', err);
  process.exit(1);
});
