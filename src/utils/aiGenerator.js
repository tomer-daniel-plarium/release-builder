const SYSTEM_PROMPT = `You are a professional release note writer for a Data Applications team at a gaming company.
Based on the uploaded documents and user comments, generate a structured release note email.

Return ONLY valid JSON with this structure:
{
  "headerTagline": "Release Notes" or "Bug Fix Update" or "Product Update" etc.,
  "components": [
    { "type": "...", "props": { ... } }
  ]
}

Available component types and their props:

tag: { "text": "New Feature", "emoji": "🚀" }
title: { "text": "...", "fontSize": 26, "bold": true }
subtitle: { "text": "...", "fontSize": 15 }
accent: {}
body: { "text": "..." }
features: { "sectionTitle": "Key Features", "items": [{ "bold": "Name", "text": "description" }] }
whatsnext: { "sectionTitle": "What's Next?", "items": [{ "bold": "Name", "badge": "Coming Soon", "text": "description" }] }
quote: { "text": "...", "attribution": "Name" }
version: { "version": "v1.0", "date": "March 2026" }
numbered: { "sectionTitle": "How To", "items": [{ "text": "Step description" }] }
button: { "text": "Try It Now →", "url": "#" }
divider: {}
spacer: { "height": 24 }
closing: { "text": "..." }

Guidelines:
- Start with version badge if version info is available
- Use tag + title + subtitle for the main announcement
- Use features for what was built, with clear user-facing value
- Use numbered for how-to steps or migration instructions
- Use whatsnext for upcoming items
- End with closing
- Keep text concise and professional
- Focus on user value, not technical implementation details
- Use quote for key insights or important notes`;

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function isTextFile(file) {
  const textTypes = ['text/', 'application/json', 'application/xml'];
  const textExts = ['.html', '.htm', '.txt', '.md', '.csv', '.json', '.xml'];
  if (textTypes.some(t => file.type.startsWith(t))) return true;
  return textExts.some(ext => file.name.toLowerCase().endsWith(ext));
}

async function buildFileParts(files) {
  const parts = [];
  for (const file of files) {
    if (isTextFile(file)) {
      const text = await readFileAsText(file);
      parts.push({ text: `--- File: ${file.name} ---\n${text}\n--- End of ${file.name} ---` });
    } else {
      const base64 = await readFileAsBase64(file);
      parts.push({ inlineData: { mimeType: file.type || 'application/octet-stream', data: base64 } });
    }
  }
  return parts;
}

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem('llm_settings') || '{}');
  } catch { return {}; }
}

async function callGeminiAIStudio(parts, model) {
  const settings = getSettings();
  const apiKey = settings.apiKey;
  if (!apiKey) throw new Error('Gemini API key not configured. Open Settings to add it.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini API error: ${res.status}`);
  }
  return res.json();
}

async function callVertexAI(parts, model) {
  const settings = getSettings();
  const { gcpProject, gcpRegion, accessToken } = settings;
  if (!gcpProject || !gcpRegion) throw new Error('GCP Project and Region are required for Vertex AI. Open Settings.');
  if (!accessToken) throw new Error('Access Token is required for Vertex AI. Run: gcloud auth print-access-token');

  const url = `https://${gcpRegion}-aiplatform.googleapis.com/v1/projects/${gcpProject}/locations/${gcpRegion}/publishers/google/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Vertex AI error: ${res.status}`);
  }
  return res.json();
}

export async function generateFromFiles(files, userComments) {
  const settings = getSettings();
  const backend = settings.backend || 'aistudio';
  const model = settings.model || 'gemini-2.0-flash';

  const fileParts = await buildFileParts(files);

  let userText = SYSTEM_PROMPT;
  if (userComments.trim()) {
    userText += `\n\nUser comments and context:\n${userComments}`;
  }

  const parts = [{ text: userText }, ...fileParts];

  const response = backend === 'vertex'
    ? await callVertexAI(parts, model)
    : await callGeminiAIStudio(parts, model);

  const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('Empty response from Gemini');

  const parsed = JSON.parse(content);
  if (!parsed.components || !Array.isArray(parsed.components)) {
    throw new Error('Invalid response structure — missing components array');
  }

  return parsed;
}
