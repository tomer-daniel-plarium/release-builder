const REPO_OWNER = 'tomer-daniel-plarium';
const REPO_NAME = 'release-builder';
const IMAGE_FOLDER = 'email-images';

function getGitHubToken() {
  try {
    const s = JSON.parse(localStorage.getItem('llm_settings') || '{}');
    return s.githubToken || '';
  } catch { return ''; }
}

function getPagesBaseUrl() {
  return `https://${REPO_OWNER}.github.io/${REPO_NAME}/${IMAGE_FOLDER}`;
}

function uniqueName(file) {
  const ts = Date.now();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  return `${ts}-${safe}`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file) {
  const token = getGitHubToken();
  if (!token) throw new Error('GitHub token not configured. Go to Settings (⚙) and add your GitHub PAT.');

  const name = uniqueName(file);
  const content = await fileToBase64(file);
  const path = `public/${IMAGE_FOLDER}/${name}`;

  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload email image: ${name}`,
      content,
      branch: 'main',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed (${res.status})`);
  }

  return `${getPagesBaseUrl()}/${name}`;
}
