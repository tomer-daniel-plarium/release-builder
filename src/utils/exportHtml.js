import { convertSvgToBlue, scaleSvg } from './svgConverter';
import { B, N1, N2, LBG, BDR, ff } from '../data/theme';
import { getHexBase64 } from '../data/hexPattern';

function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderComp(c) {
  const p = c.props;

  if (c.type === 'tag')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0 0 12px 0;font-family:${ff};">
      <table cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${LBG};color:${B};font-family:${ff};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:20px;">${esc(p.emoji)} ${esc(p.text)}</td></tr></table>
    </td></tr></table>`;

  if (c.type === 'title')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:${p.fontSize || 26}px;font-weight:${p.bold ? 800 : 400};color:${p.color || N1};line-height:1.25;padding:0 0 10px 0;text-align:${p.alignment || 'left'};" class="email-title">${esc(p.text)}</td></tr></table>`;

  if (c.type === 'subtitle')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:${p.fontSize || 15}px;color:${p.color || '#5a7a99'};font-style:italic;line-height:1.5;padding:0 0 22px 0;">${esc(p.text)}</td></tr></table>`;

  if (c.type === 'accent')
    return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px 0;"><tr><td style="width:${p.width || 60}px;height:2px;background:${p.color || B};border-radius:2px;font-size:0;line-height:0;">&nbsp;</td><td style="width:${p.width || 60}px;height:2px;background:transparent;font-size:0;line-height:0;">&nbsp;</td></tr></table>`;

  if (c.type === 'body')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:${p.fontSize || 15}px;color:${p.color || '#2c3e55'};line-height:1.7;padding:0 0 28px 0;">${esc(p.text).replace(/\n/g, '<br/>')}</td></tr></table>`;

  if (c.type === 'image') {
    if (p.url) {
      const align = p.alignment || 'center';
      if (p.width) {
        const margin = align === 'center' ? 'margin:0 auto;' : align === 'right' ? 'margin-left:auto;' : '';
        return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;"><tr><td align="${align}" style="padding:0;"><img src="${esc(p.url)}" width="${p.width}" style="display:block;${margin}" alt="${esc(p.caption || '')}"/></td></tr></table>`;
      }
      return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;"><tr><td style="padding:0;"><img src="${esc(p.url)}" width="100%" style="display:block;border-radius:10px;" alt="${esc(p.caption || '')}"/></td></tr></table>`;
    }
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;"><tr><td align="center" valign="middle" style="height:${p.height || 180}px;background:linear-gradient(135deg,${N1},${N2});border-radius:10px;padding:20px;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="color:rgba(255,255,255,0.4);font-family:${ff};font-size:12px;letter-spacing:2px;text-transform:uppercase;">${esc(p.caption || 'Image placeholder')}</td></tr></table></td></tr></table>`;
  }

  if (c.type === 'features') {
    const rows = (p.items || []).map(it =>
      `<tr><td width="16" valign="top" style="padding-top:3px;color:${B};font-size:11px;line-height:1;">&#9656;</td><td style="padding-left:8px;padding-bottom:14px;font-family:${ff};font-size:14px;color:#2c3e55;line-height:1.65;"><strong style="color:${N1};">${esc(it.bold)}</strong> &mdash; ${esc(it.text)}</td></tr>`
    ).join('');
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:17px;font-weight:800;color:${N1};padding:0 0 10px 0;border-bottom:1.5px solid ${BDR};">${esc(p.sectionTitle || '')}</td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 28px 0;">${rows}</table>`;
  }

  if (c.type === 'button')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;" class="email-cta"><tr><td align="${p.alignment || 'center'}" style="padding:0;">
      <table cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${p.color || B};border-radius:6px;text-align:center;"><a href="${esc(p.url || '#')}" style="display:inline-block;color:#fff;font-family:${ff};font-size:15px;font-weight:700;padding:10px 50px;text-decoration:none;letter-spacing:0.5px;">${esc(p.text)}</a></td></tr></table>
    </td></tr></table>`;

  if (c.type === 'whatsnext') {
    const rows = (p.items || []).map(it => {
      const badge = it.badge
        ? `<table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;vertical-align:middle;margin-left:6px;"><tr><td style="background:#dce8fb;color:${B};font-family:${ff};font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:2px 7px;border-radius:10px;">${esc(it.badge)}</td></tr></table>`
        : '';
      return `<tr><td width="16" valign="top" style="padding-top:3px;color:${B};font-size:11px;line-height:1;">&#9656;</td><td style="padding-left:8px;padding-bottom:14px;font-family:${ff};font-size:14px;color:#2c3e55;line-height:1.65;"><strong style="color:${N1};">${esc(it.bold)}</strong>${badge}<br/>${esc(it.text)}</td></tr>`;
    }).join('');
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${LBG};border-radius:10px;margin:0 0 28px 0;border:1px solid ${BDR};"><tr><td style="padding:22px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:17px;font-weight:800;color:${N1};padding:0 0 10px 0;border-bottom:1.5px solid ${BDR};">${esc(p.sectionTitle || '')}</td></tr></table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">${rows}</table>
    </td></tr></table>`;
  }

  if (c.type === 'quote') {
    const attr = p.attribution ? `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:12px;color:#5a7a99;padding:10px 0 0 0;">&mdash; ${esc(p.attribution)}</td></tr></table>` : '';
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;"><tr><td style="border-left:3px solid ${p.color || B};background:#f8fafd;padding:16px 20px;border-radius:0 8px 8px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:15px;font-style:italic;color:#2c3e55;line-height:1.7;">${esc(p.text)}</td></tr></table>${attr}
    </td></tr></table>`;
  }

  if (c.type === 'version')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;"><tr><td align="${p.alignment || 'left'}">
      <table cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${LBG};color:${B};font-family:${ff};font-size:12px;font-weight:700;padding:5px 14px;border-radius:20px;letter-spacing:0.5px;">${esc(p.version)} &mdash; ${esc(p.date)}</td></tr></table>
    </td></tr></table>`;

  if (c.type === 'numbered') {
    const rows = (p.items || []).map((it, idx) =>
      `<tr><td width="30" valign="top" style="padding-top:0;"><table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="width:22px;height:22px;background:${B};color:#fff;font-family:${ff};font-size:11px;font-weight:700;border-radius:50%;line-height:22px;">${idx + 1}</td></tr></table></td><td style="padding-left:10px;padding-bottom:14px;font-family:${ff};font-size:14px;color:#2c3e55;line-height:1.65;">${esc(it.text)}</td></tr>`
    ).join('');
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:${ff};font-size:17px;font-weight:800;color:${N1};padding:0 0 10px 0;border-bottom:1.5px solid ${BDR};">${esc(p.sectionTitle || '')}</td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 28px 0;">${rows}</table>`;
  }

  if (c.type === 'divider')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;"><tr><td style="height:${p.thickness || 1}px;background:${p.color || BDR};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;

  if (c.type === 'spacer')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:${p.height || 24}px;font-size:0;line-height:0;">&nbsp;</td></tr></table>`;

  if (c.type === 'closing')
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1.5px solid #eef3fb;padding-top:20px;text-align:center;font-family:${ff};font-size:${p.fontSize || 14}px;color:${p.color || '#4a6a8a'};line-height:1.8;">${esc(p.text).replace(/\n/g, '<br/>')}</td></tr></table>`;

  return '';
}

export function generateEmailHtml(app, components, { headerTagline = 'Release Notes', senderEmail = '', logoUrls = {}, headerScreenshotUrl = null } = {}) {
  const blueSvg = convertSvgToBlue(app.svgRaw || '');
  const hexBg = getHexBase64();

  let headerLogo = '';
  if (app.headerImage) {
    headerLogo = `<img src="${esc(app.headerImage)}" width="100%" style="display:block;pointer-events:none;border:0;border-radius:8px;" alt="${esc(app.name)}"/>`;
  } else if (logoUrls.header) {
    headerLogo = `<img src="${esc(logoUrls.header)}" width="110" height="127" style="display:block;pointer-events:none;border:0;" alt="${esc(app.name)}"/>`;
  } else if (blueSvg) {
    headerLogo = scaleSvg(blueSvg, 110, 127);
  }

  let footerLogoImg = '';
  if (logoUrls.footer) {
    footerLogoImg = `<img src="${esc(logoUrls.footer)}" width="24" height="28" style="display:block;pointer-events:none;border:0;" alt="${esc(app.name)}"/>`;
  } else if (blueSvg) {
    footerLogoImg = scaleSvg(blueSvg, 24, 28);
  }

  const body = components.map(renderComp).join('\n');

  const footerLogo = footerLogoImg
    ? `<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 10px;"><tr><td valign="middle" style="padding-right:8px;">${footerLogoImg}</td><td valign="middle" style="color:#fff;font-family:${ff};font-size:16px;font-weight:700;letter-spacing:1px;">${esc(app.name)}</td></tr></table>`
    : `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="color:#fff;font-family:${ff};font-size:16px;font-weight:700;letter-spacing:1px;padding:0 0 10px 0;">${esc(app.name)}</td></tr></table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(app.name)} Release Note</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;0,800;1,400&display=swap" rel="stylesheet"/>
<style>
@media (max-width:620px){
  .email-wrapper{margin:0!important;border-radius:0!important;}
  .email-content{padding:24px 20px!important;}
  .email-title{font-size:20px!important;}
  .email-cta td table td a{display:block!important;text-align:center!important;padding:12px 20px!important;}
  .email-footer{padding:20px!important;}
}
</style>
</head>
<body style="background:#f0f2f5;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f2f5;">
<tr><td align="center" style="padding:32px 16px;">

<table class="email-wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">

<!-- HEADER -->
${(app.headerImage || headerScreenshotUrl) ? `<tr><td style="padding:0;font-size:0;line-height:0;border-bottom:2px solid ${B};">
  <img src="${esc(app.headerImage || headerScreenshotUrl)}" width="600" style="display:block;width:100%;height:auto;pointer-events:none;border:0;" alt="${esc(app.name)}"/>
</td></tr>` : `<tr><td style="background-color:${N1};background-image:url(${hexBg});background-size:cover;background-position:center;border-bottom:2px solid ${B};">
<!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;"><v:fill type="gradient" color="${N1}" color2="${N2}" angle="135"/><v:textbox inset="0,0,0,0"><![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:24px 40px 0 40px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr><td align="center" style="color:${B};font-family:${ff};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:0 0 20px 0;">Data Applications &nbsp;&middot;&nbsp; Midcore District, MTG</td></tr>
      </table>
    </td></tr>
    ${headerLogo ? `<tr><td align="center" style="padding:0 40px;">${headerLogo}</td></tr>` : ''}
    <tr><td align="center" style="color:#fff;font-family:${ff};font-size:24px;font-weight:800;letter-spacing:2px;padding:12px 40px 0 40px;">${esc(app.name)}</td></tr>
    <tr><td align="center" style="color:${B};font-family:${ff};font-size:10px;letter-spacing:4px;text-transform:uppercase;padding:5px 40px 28px 40px;">${esc(headerTagline)}</td></tr>
  </table>
<!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
</td></tr>`}

<!-- BODY -->
<tr><td class="email-content" style="padding:32px 48px 36px;background:#fff;">
${body}
</td></tr>

<!-- FOOTER -->
<tr><td class="email-footer" style="background:linear-gradient(135deg,${N1},${N2});padding:28px 40px;text-align:center;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:0 0 10px 0;">${footerLogo}</td></tr>
    <tr><td align="center" style="color:${B};font-family:${ff};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:0 0 14px 0;">Data Applications &middot; Midcore District, MTG</td></tr>
    <tr><td style="padding:0 0 14px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background:rgba(255,255,255,0.1);font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
    ${(senderEmail || app.email) ? `<tr><td align="center" style="padding:0 0 10px 0;"><a href="mailto:${esc(senderEmail || app.email)}" style="color:${B};font-family:${ff};font-size:12px;text-decoration:none;">${esc(senderEmail || app.email)}</a></td></tr>` : ''}
    <tr><td align="center" style="color:#4a6a8a;font-family:${ff};font-size:11px;line-height:1.6;">* Optimized for desktop. Mobile experience may vary.</td></tr>
  </table>
</td></tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}
