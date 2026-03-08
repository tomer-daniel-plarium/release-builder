function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function luminance(r, g, b) {
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

function isWhiteish(r, g, b) {
  return r > 220 && g > 220 && b > 220;
}

function isDark(r, g, b) {
  return luminance(r, g, b) < 0.3;
}

function convertColor(hex) {
  const [r, g, b] = hexToRgb(hex);

  if (isWhiteish(r, g, b)) return '#5A8DE3';

  if (isDark(r, g, b)) {
    const bR = 13, bG = 27, bB = 46;
    const mix = 0.3;
    return rgbToHex(
      r * (1 - mix) + bR * mix,
      g * (1 - mix) + bG * mix,
      b * (1 - mix) + bB * mix,
    );
  }

  const lum = luminance(r, g, b);
  const bR = 90, bG = 141, bB = 227;
  if (lum > 0.6) {
    return rgbToHex(
      bR * 0.55 + r * 0.45 * lum,
      bG * 0.55 + g * 0.45 * lum,
      bB * 0.55 + b * 0.45 * lum,
    );
  }
  return rgbToHex(
    bR * 0.5 + r * 0.5 * lum * 1.5,
    bG * 0.5 + g * 0.5 * lum * 1.5,
    bB * 0.5 + b * 0.5 * lum * 1.5,
  );
}

export function convertSvgToBlue(svgString) {
  if (!svgString) return '';

  return svgString
    .replace(/fill="(#[0-9a-fA-F]{3,6})"/g, (_, hex) => `fill="${convertColor(hex)}"`)
    .replace(/stroke="(#[0-9a-fA-F]{3,6})"/g, (_, hex) => `stroke="${convertColor(hex)}"`)
    .replace(/stroke="white"/gi, 'stroke="#5A8DE3"')
    .replace(/fill="white"/gi, 'fill="#5A8DE3" fill-opacity="0.15"');
}

export function scaleSvg(svg, w, h) {
  if (!svg) return '';
  return svg
    .replace(/width="[\d.]+"/, `width="${w}"`)
    .replace(/height="[\d.]+"/, `height="${h}"`);
}

export function getPlaceholderSvg(name) {
  const letter = (name || '?')[0].toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <rect x="8" y="8" width="48" height="48" rx="12" stroke="#5A8DE3" stroke-width="2" fill="#5A8DE3" fill-opacity="0.1"/>
    <text x="32" y="40" text-anchor="middle" fill="#5A8DE3" font-family="Arial,sans-serif" font-size="24" font-weight="700">${letter}</text>
  </svg>`;
}
