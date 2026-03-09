import { v4 as uuidv4 } from 'uuid';

function txt(el) {
  return (el?.textContent || '').trim();
}

function style(el) {
  return el?.getAttribute?.('style') || '';
}

function has(el, query) {
  try { return el?.querySelector?.(query); } catch { return null; }
}

function allTds(el) {
  return Array.from(el?.querySelectorAll?.('td') || []);
}

function isTag(el) {
  const td = has(el, 'td[style*="border-radius:20px"]') || has(el, 'td[style*="border-radius: 20px"]');
  if (!td) return null;
  const raw = txt(td);
  const emojiMatch = raw.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u);
  const emoji = emojiMatch ? emojiMatch[0].trim() : '🚀';
  const text = emojiMatch ? raw.slice(emojiMatch[0].length).trim() : raw;
  return { type: 'tag', props: { text, emoji } };
}

function isTitle(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return (s.includes('font-size:26px') || s.includes('font-size:24px') || s.includes('font-size: 26px')) &&
           (s.includes('font-weight:800') || s.includes('font-weight: 800'));
  });
  if (!td) return null;
  return { type: 'title', props: { text: txt(td), fontSize: 26, bold: true } };
}

function isSubtitle(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return s.includes('font-style:italic') && (s.includes('color:#5a7a99') || s.includes('color: #5a7a99'));
  });
  if (!td) return null;
  return { type: 'subtitle', props: { text: txt(td), fontSize: 15 } };
}

function isAccent(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return (s.includes('width:60px') || s.includes('width: 60px')) &&
           (s.includes('height:2px') || s.includes('height: 2px'));
  });
  if (!td) return null;
  return { type: 'accent', props: {} };
}

function isQuote(el) {
  const td = allTds(el).find(t => style(t).includes('border-left:3px solid'));
  if (!td) return null;
  const innerTd = has(td, 'td');
  return { type: 'quote', props: { text: txt(innerTd || td), attribution: '' } };
}

function isButton(el) {
  const a = has(el, 'a[style*="background"]');
  if (!a || !style(a).includes('font-weight:700') && !style(a).includes('font-weight: 700')) return null;
  return { type: 'button', props: { text: txt(a).replace(/→/g, '→'), url: a.getAttribute('href') || '#' } };
}

function isImage(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return s.includes('height:220px') || s.includes('height: 220px') ||
           (s.includes('background:linear-gradient') && txt(t).toLowerCase().includes('screenshot'));
  });
  if (!td) return null;
  return { type: 'image', props: { url: '', caption: 'Replace with your screenshot', height: 180 } };
}

function isVersion(el) {
  const text = txt(el);
  if (/^v\d/.test(text) && text.includes('·')) {
    const parts = text.split('·').map(s => s.trim());
    return { type: 'version', props: { version: parts[0], date: parts[1] || '' } };
  }
  return null;
}

function isDivider(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return (s.includes('height:1px') || s.includes('height: 1px')) &&
           (s.includes('background:') || s.includes('border-top:'));
  });
  if (!td) return null;
  return { type: 'divider', props: {} };
}

function isSpacer(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return s.includes('height:') && !s.includes('background') && txt(t) === '';
  });
  if (txt(el).trim() === '' && style(el).includes('height')) return { type: 'spacer', props: { height: 24 } };
  return null;
}

function directRows(table) {
  const tbody = table?.querySelector(':scope > tbody') || table;
  return Array.from(tbody?.children || []).filter(el => el.tagName === 'TR');
}

function directTds(row) {
  return Array.from(row?.children || []).filter(el => el.tagName === 'TD');
}

function isBulletRow(row) {
  const tds = directTds(row);
  if (tds.length < 2) return false;
  const first = tds[0];
  return (first.getAttribute('width') === '16' || /[\u25B6-\u25C0\u2022\u2023\u25AA]/.test(txt(first)));
}

function parseFeatureItems(table) {
  return directRows(table).filter(r => isBulletRow(r)).map(r => {
    const tds = directTds(r);
    const contentTd = tds[1];
    if (!contentTd) return null;
    const strong = contentTd.querySelector('strong');
    const boldText = strong ? txt(strong) : '';
    let rest = contentTd.innerHTML;
    if (strong) rest = rest.replace(strong.outerHTML, '');
    rest = rest.replace(/^[\s—–-]+/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return { bold: boldText, text: rest };
  }).filter(Boolean);
}

function parseNumberedItems(table) {
  return directRows(table).filter(r => {
    const tds = directTds(r);
    return tds.length >= 2 && tds[0].getAttribute('width') === '30';
  }).map(r => {
    const tds = directTds(r);
    const contentTd = tds[tds.length - 1];
    return { text: txt(contentTd) };
  });
}

function parseWhatsNextItems(table) {
  return directRows(table).filter(r => isBulletRow(r)).map(r => {
    const contentTd = r.querySelectorAll('td')[1];
    if (!contentTd) return null;
    const strong = contentTd.querySelector('strong');
    const boldText = strong ? txt(strong) : '';
    const badgeTd = contentTd.querySelector('td[style*="border-radius:10px"]');
    const badge = badgeTd ? txt(badgeTd) : '';
    let rest = contentTd.innerHTML;
    if (strong) rest = rest.replace(strong.outerHTML, '');
    const badgeTable = contentTd.querySelector('table');
    if (badgeTable) rest = rest.replace(badgeTable.outerHTML, '');
    rest = rest.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return { bold: boldText, badge: badge, text: rest };
  }).filter(Boolean);
}

function isSectionWithItems(el, nextEl) {
  const headerTd = allTds(el).find(t => {
    const s = style(t);
    return (s.includes('font-size:17px') || s.includes('font-size: 17px')) &&
           (s.includes('font-weight:800') || s.includes('font-weight: 800')) &&
           s.includes('border-bottom');
  });
  if (!headerTd || !nextEl) return null;

  const sectionTitle = txt(headerTd);

  const hasNumbers = nextEl.querySelector('td[style*="border-radius:50%"], td[style*="border-radius: 50%"]');
  if (hasNumbers) {
    const items = parseNumberedItems(nextEl);
    if (items.length > 0) {
      return { type: 'numbered', props: { sectionTitle, items }, _skip: 1 };
    }
  }

  const items = parseFeatureItems(nextEl);
  if (items.length > 0) {
    const lowerTitle = sectionTitle.toLowerCase();
    if (lowerTitle.includes('next') || lowerTitle.includes('coming') || lowerTitle.includes('upcoming')) {
      return { type: 'whatsnext', props: { sectionTitle, items: items.map(it => ({ ...it, badge: '' })) }, _skip: 1 };
    }
    return { type: 'features', props: { sectionTitle, items }, _skip: 1 };
  }

  return null;
}

function isWhatsNextBlock(el) {
  const s = style(el);
  if (!s.includes('background:#ECF2FC') && !s.includes('background: #ECF2FC')) return null;

  const headerTd = allTds(el).find(t => {
    const ts = style(t);
    return (ts.includes('font-size:17px') || ts.includes('font-size: 17px')) &&
           (ts.includes('font-weight:800') || ts.includes('font-weight: 800'));
  });
  if (!headerTd) return null;
  const sectionTitle = txt(headerTd);

  const itemsTables = el.querySelectorAll('table[style*="margin-top"]');
  let items = [];
  for (const t of itemsTables) {
    items = items.concat(parseWhatsNextItems(t));
  }
  if (items.length === 0) {
    items = parseWhatsNextItems(el);
  }
  if (items.length > 0) {
    return { type: 'whatsnext', props: { sectionTitle, items } };
  }
  return null;
}

function isBody(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return (s.includes('font-size:15px') || s.includes('font-size: 15px') || s.includes('font-size:14px')) &&
           (s.includes('color:#2c3e55') || s.includes('color: #2c3e55') || s.includes('color:#4a6a8a'));
  });
  if (!td) return null;
  return { type: 'body', props: { text: txt(td) } };
}

function isClosing(el) {
  const td = allTds(el).find(t => {
    const s = style(t);
    return (s.includes('text-align:center') || s.includes('text-align: center')) &&
           (s.includes('border-top') || s.includes('color:#4a6a8a') || s.includes('color: #4a6a8a'));
  });
  if (!td) return null;
  const text = td.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
  return { type: 'closing', props: { text, fontSize: 14 } };
}

export function importFromHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  let tagline = 'Release Notes';
  const allTdsInDoc = doc.querySelectorAll('td');
  for (const td of allTdsInDoc) {
    const s = style(td);
    if ((s.includes('letter-spacing:4px') || s.includes('letter-spacing: 4px')) &&
        s.includes('text-transform:uppercase')) {
      tagline = txt(td);
      break;
    }
  }

  const contentTd = doc.querySelector('.email-content') ||
    doc.querySelector('td[style*="padding:32px 48px"]');

  if (!contentTd) return null;

  const children = Array.from(contentTd.children).filter(el => el.tagName === 'TABLE');
  const components = [];
  let i = 0;

  while (i < children.length) {
    const el = children[i];
    const nextEl = children[i + 1];
    let comp = null;

    comp = comp || isTag(el);
    comp = comp || isVersion(el);
    comp = comp || isTitle(el);
    comp = comp || isSubtitle(el);
    comp = comp || isAccent(el);
    comp = comp || isQuote(el);
    comp = comp || isImage(el);
    comp = comp || isWhatsNextBlock(el);
    comp = comp || isButton(el);
    comp = comp || isSectionWithItems(el, nextEl);
    comp = comp || isClosing(el);
    comp = comp || isDivider(el);
    comp = comp || isSpacer(el);
    comp = comp || isBody(el);

    if (comp) {
      const skip = comp._skip || 0;
      delete comp._skip;
      components.push({ id: uuidv4(), ...comp });
      i += 1 + skip;
    } else {
      i++;
    }
  }

  return { components, headerTagline: tagline };
}
