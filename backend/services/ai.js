const axios = require('axios');

/**
 * Tiny AI provider layer so the app can run against:
 *   - Ollama  (local dev, free, no API key)        AI_PROVIDER=ollama
 *   - Groq    (production, hosted Llama 3, free)    AI_PROVIDER=groq   (default)
 *
 * Both expose the same two functions:
 *   streamChat({ system, user, clientRes }) -> streams text to the client, resolves with full text
 *   jsonCompletion({ prompt, image })       -> resolves with a parsed JSON object
 */

const PROVIDER = (process.env.AI_PROVIDER || 'groq').toLowerCase();

// --- Groq (OpenAI-compatible) ---
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
// Vision model for meal photos. Model names change — check https://console.groq.com/docs/models
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';

// --- Ollama ---
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
const OLLAMA_MODEL = process.env.AI_MODEL || 'phi3:latest';
const OLLAMA_VISION_MODEL = process.env.AI_VISION_MODEL || 'llava';

console.log(`AI provider: ${PROVIDER}` + (PROVIDER === 'groq' && !GROQ_KEY ? ' (WARNING: GROQ_API_KEY not set)' : ''));

// Parse JSON even if the model wraps it in prose or code fences.
function parseJson(text) {
    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error('Model did not return JSON');
    }
}

const groqHeaders = () => ({ Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' });

// ============ streaming chat ============
async function streamChat(opts) {
    return PROVIDER === 'ollama' ? ollamaStream(opts) : groqStream(opts);
}

async function groqStream({ system, user, clientRes }) {
    const resp = await axios.post(
        GROQ_URL,
        {
            model: GROQ_MODEL,
            messages: [
                ...(system ? [{ role: 'system', content: system }] : []),
                { role: 'user', content: user },
            ],
            stream: true,
        },
        { responseType: 'stream', timeout: 120000, headers: groqHeaders() }
    );

    return new Promise((resolve, reject) => {
        let full = '';
        let buffer = '';
        resp.data.on('data', (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep the trailing partial line for next chunk
            for (let line of lines) {
                line = line.trim();
                if (!line.startsWith('data:')) continue;
                const data = line.slice(5).trim();
                if (data === '[DONE]') continue;
                try {
                    const token = JSON.parse(data).choices?.[0]?.delta?.content || '';
                    if (token) { full += token; clientRes.write(token); }
                } catch { /* partial JSON, wait for more */ }
            }
        });
        resp.data.on('end', () => { clientRes.end(); resolve(full); });
        resp.data.on('error', (err) => { try { clientRes.end(); } catch { /* noop */ } reject(err); });
    });
}

async function ollamaStream({ system, user, clientRes }) {
    const prompt = `${system || ''}\n\nUser: ${user}\nAssistant:`;
    const resp = await axios.post(
        OLLAMA_URL,
        { model: OLLAMA_MODEL, prompt, stream: true },
        { responseType: 'stream', timeout: 120000 }
    );

    return new Promise((resolve, reject) => {
        let full = '';
        resp.data.on('data', (buf) => {
            buf.toString().split('\n').forEach((line) => {
                line = line.trim();
                if (!line) return;
                try {
                    const json = JSON.parse(line);
                    if (json.response) { full += json.response; clientRes.write(json.response); }
                } catch { /* ignore non-JSON lines */ }
            });
        });
        resp.data.on('end', () => { clientRes.end(); resolve(full); });
        resp.data.on('error', (err) => { try { clientRes.end(); } catch { /* noop */ } reject(err); });
    });
}

// ============ JSON completion (meal analysis) ============
async function jsonCompletion(opts) {
    return PROVIDER === 'ollama' ? ollamaJson(opts) : groqJson(opts);
}

async function groqJson({ prompt, image }) {
    const content = image
        ? [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: image } }, // full data: URL is expected
        ]
        : prompt;

    const body = {
        model: image ? GROQ_VISION_MODEL : GROQ_MODEL,
        messages: [{ role: 'user', content }],
        stream: false,
    };
    // Vision models don't always support JSON mode; only request it for text.
    if (!image) body.response_format = { type: 'json_object' };

    const resp = await axios.post(GROQ_URL, body, { timeout: 120000, headers: groqHeaders() });
    return parseJson(resp.data.choices[0].message.content);
}

async function ollamaJson({ prompt, image }) {
    const payload = { model: image ? OLLAMA_VISION_MODEL : OLLAMA_MODEL, prompt, stream: false, format: 'json' };
    if (image) payload.images = [image.replace(/^data:image\/\w+;base64,/, '')];
    const resp = await axios.post(OLLAMA_URL, payload, { timeout: 180000 });
    return parseJson(resp.data.response);
}

module.exports = { streamChat, jsonCompletion, PROVIDER };
