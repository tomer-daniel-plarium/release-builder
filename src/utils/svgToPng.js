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

function cacheKey(appId, size) {
  return `logo_png_${appId}_${size}`;
}

function svgToCanvas(svgString, width, height) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width * scale, height * scale);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG render failed')); };
    img.src = url;
  });
}

async function uploadPng(canvas, filename) {
  const token = getToken();
  if (!token) return null;

  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const path = `public/${IMG_FOLDER}/${filename}`;
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  let sha;
  const check = await fetch(apiUrl, { headers });
  if (check.ok) {
    const data = await check.json();
    sha = data.sha;
  }

  const body = { message: `Upload logo: ${filename}`, content: base64, branch: 'main' };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) return null;
  return pagesUrl(filename);
}

export async function getLogoPngUrls(appId, svgString, headerW, headerH, footerW, footerH) {
  if (!svgString) return { header: null, footer: null };

  const hKey = cacheKey(appId, 'header');
  const fKey = cacheKey(appId, 'footer');
  const cached = { header: localStorage.getItem(hKey), footer: localStorage.getItem(fKey) };
  if (cached.header && cached.footer) return cached;

  try {
    const [hCanvas, fCanvas] = await Promise.all([
      svgToCanvas(svgString, headerW, headerH),
      svgToCanvas(svgString, footerW, footerH),
    ]);

    const hName = `logo-${appId}-header.png`;
    const fName = `logo-${appId}-footer.png`;

    const [hUrl, fUrl] = await Promise.all([
      cached.header || uploadPng(hCanvas, hName),
      cached.footer || uploadPng(fCanvas, fName),
    ]);

    if (hUrl) localStorage.setItem(hKey, hUrl);
    if (fUrl) localStorage.setItem(fKey, fUrl);

    return { header: hUrl, footer: fUrl };
  } catch {
    return { header: null, footer: null };
  }
}
