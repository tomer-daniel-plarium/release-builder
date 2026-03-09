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

function prepareSvg(svgString, width, height) {
  let svg = svgString;
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  svg = svg
    .replace(/width="[\d.]+"/, `width="${width}"`)
    .replace(/height="[\d.]+"/, `height="${height}"`);
  return svg;
}

function svgToCanvas(svgString, width, height) {
  const svg = prepareSvg(svgString, width, height);
  return new Promise((resolve, reject) => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width * scale, height * scale);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      console.error('SVG render to Image failed', e);
      reject(new Error('SVG render failed'));
    };
    img.src = url;
  });
}

async function uploadPng(canvas, filename) {
  const token = getToken();
  if (!token) {
    console.warn('No GitHub token configured — cannot upload logo PNG');
    return null;
  }

  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const path = `public/${IMG_FOLDER}/${filename}`;
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  let sha;
  try {
    const check = await fetch(apiUrl, { headers });
    if (check.ok) {
      const data = await check.json();
      sha = data.sha;
    }
  } catch (e) {
    console.warn('Failed to check existing file, will try creating new', e);
  }

  const body = { message: `Upload logo: ${filename}`, content: base64, branch: 'main' };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    console.error('GitHub upload failed', res.status, text);
    return null;
  }
  return pagesUrl(filename);
}

export async function getLogoPngUrls(appId, svgString, headerW, headerH, footerW, footerH) {
  if (!svgString) return { header: null, footer: null };

  const hKey = cacheKey(appId, 'header');
  const fKey = cacheKey(appId, 'footer');
  const cachedH = localStorage.getItem(hKey);
  const cachedF = localStorage.getItem(fKey);
  if (cachedH && cachedF) return { header: cachedH, footer: cachedF };

  try {
    const [hCanvas, fCanvas] = await Promise.all([
      cachedH ? null : svgToCanvas(svgString, headerW, headerH),
      cachedF ? null : svgToCanvas(svgString, footerW, footerH),
    ]);

    const hName = `logo-${appId}-header.png`;
    const fName = `logo-${appId}-footer.png`;

    const [hUrl, fUrl] = await Promise.all([
      cachedH || uploadPng(hCanvas, hName),
      cachedF || uploadPng(fCanvas, fName),
    ]);

    if (hUrl) localStorage.setItem(hKey, hUrl);
    if (fUrl) localStorage.setItem(fKey, fUrl);

    return { header: hUrl || null, footer: fUrl || null };
  } catch (e) {
    console.error('Logo PNG conversion failed', e);
    return { header: null, footer: null };
  }
}
