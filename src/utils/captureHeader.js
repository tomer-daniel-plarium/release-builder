import html2canvas from 'html2canvas';

const REPO_OWNER = 'tomer-daniel-plarium';
const REPO_NAME = 'release-builder';
const IMG_FOLDER = 'email-images';

function getToken() {
  try { return JSON.parse(localStorage.getItem('llm_settings') || '{}').githubToken || ''; }
  catch { return ''; }
}

function pagesUrl(name) {
  return `https://${REPO_OWNER}.github.io/${REPO_NAME}/${IMG_FOLDER}/${name}`;
}

async function uploadBase64(base64Data, filename) {
  const token = getToken();
  if (!token) {
    console.warn('No GitHub token — cannot upload header screenshot');
    return null;
  }

  const path = `public/${IMG_FOLDER}/${filename}`;
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  let sha;
  try {
    const check = await fetch(apiUrl, { headers });
    if (check.ok) sha = (await check.json()).sha;
  } catch {}

  const body = { message: `Upload header: ${filename}`, content: base64Data, branch: 'main' };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    console.error('Header upload failed', res.status, await res.text());
    return null;
  }
  return pagesUrl(filename);
}

export async function captureHeaderPng(appId) {
  const el = document.querySelector('[data-header-capture]');
  if (!el) return null;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const filename = `header-${appId}-${Date.now()}.png`;
  return uploadBase64(base64, filename);
}
