import { v4 as uuidv4 } from 'uuid';

export const STARTER_TEMPLATES = [
  {
    id: 'tpl-feature',
    name: 'Feature Release',
    app_id: 'lab360',
    created_by: 'System',
    components: [
      { id: uuidv4(), type: 'version', props: { version: 'v1.0.0', date: 'March 2026', alignment: 'left' } },
      { id: uuidv4(), type: 'tag', props: { text: 'New Feature', emoji: '✨' } },
      { id: uuidv4(), type: 'title', props: { text: 'Introducing: Feature Name', fontSize: 26, bold: true, color: '#0d1b2e', alignment: 'left' } },
      { id: uuidv4(), type: 'subtitle', props: { text: 'A brief tagline about this feature', fontSize: 15, color: '#5a7a99' } },
      { id: uuidv4(), type: 'accent', props: { color: '#5A8DE3', width: 60 } },
      { id: uuidv4(), type: 'body', props: { text: 'Describe what this feature does and why it matters to users. Keep it concise but informative.', fontSize: 15, color: '#2c3e55' } },
      { id: uuidv4(), type: 'image', props: { url: '', caption: 'Feature screenshot', height: 220 } },
      { id: uuidv4(), type: 'features', props: { sectionTitle: "What's New", items: [{ bold: 'Capability One', text: 'What it does and why it matters' }, { bold: 'Capability Two', text: 'What it does and why it matters' }] } },
      { id: uuidv4(), type: 'quote', props: { text: 'This update reduces processing time by 40%, directly impacting team velocity.', attribution: 'Internal benchmark', color: '#5A8DE3' } },
      { id: uuidv4(), type: 'button', props: { text: 'Try It Now →', url: '#', color: '#5A8DE3', alignment: 'left' } },
      { id: uuidv4(), type: 'whatsnext', props: { sectionTitle: "What's Coming Next", items: [{ bold: 'Next Feature', badge: 'Coming Soon', text: 'Brief teaser' }] } },
      { id: uuidv4(), type: 'closing', props: { text: 'Questions or feedback? Reply to this email — we read everything.', fontSize: 14, color: '#4a6a8a' } },
    ],
  },
  {
    id: 'tpl-bugfix',
    name: 'Bug Fix',
    app_id: 'lab360',
    created_by: 'System',
    components: [
      { id: uuidv4(), type: 'tag', props: { text: 'Bug Fix', emoji: '🐛' } },
      { id: uuidv4(), type: 'version', props: { version: 'v1.0.1', date: 'March 2026', alignment: 'left' } },
      { id: uuidv4(), type: 'title', props: { text: 'Bug Fix: Issue Name', fontSize: 26, bold: true, color: '#0d1b2e', alignment: 'left' } },
      { id: uuidv4(), type: 'body', props: { text: 'We identified and fixed an issue that affected... Here is what happened and what we did about it.', fontSize: 15, color: '#2c3e55' } },
      { id: uuidv4(), type: 'features', props: { sectionTitle: 'What Was Fixed', items: [{ bold: 'Fix One', text: 'Description of what was fixed' }, { bold: 'Fix Two', text: 'Description of what was fixed' }] } },
      { id: uuidv4(), type: 'button', props: { text: 'See Changes →', url: '#', color: '#5A8DE3', alignment: 'left' } },
      { id: uuidv4(), type: 'closing', props: { text: 'Questions or feedback? Reply to this email — we read everything.', fontSize: 14, color: '#4a6a8a' } },
    ],
  },
  {
    id: 'tpl-sprint',
    name: 'Sprint Update',
    app_id: 'lab360',
    created_by: 'System',
    components: [
      { id: uuidv4(), type: 'tag', props: { text: 'Sprint Update', emoji: '📋' } },
      { id: uuidv4(), type: 'title', props: { text: 'Sprint 42 — Summary', fontSize: 26, bold: true, color: '#0d1b2e', alignment: 'left' } },
      { id: uuidv4(), type: 'body', props: { text: 'Here is a summary of what the team shipped this sprint and what is coming up next.', fontSize: 15, color: '#2c3e55' } },
      { id: uuidv4(), type: 'numbered', props: { sectionTitle: 'Completed This Sprint', items: [{ text: 'Shipped feature X — now live for all users' }, { text: 'Resolved performance issue in reports dashboard' }, { text: 'Updated data pipeline for faster ingestion' }] } },
      { id: uuidv4(), type: 'whatsnext', props: { sectionTitle: 'Sprint Progress', items: [{ bold: 'In Progress Item', badge: 'In Progress', text: 'Expected next sprint' }, { bold: 'Planned Item', badge: 'Coming Soon', text: 'On the roadmap' }] } },
      { id: uuidv4(), type: 'closing', props: { text: 'Questions or feedback? Reply to this email — we read everything.', fontSize: 14, color: '#4a6a8a' } },
    ],
  },
  {
    id: 'tpl-announcement',
    name: 'Product Announcement',
    app_id: 'lab360',
    created_by: 'System',
    components: [
      { id: uuidv4(), type: 'tag', props: { text: 'Announcement', emoji: '📣' } },
      { id: uuidv4(), type: 'title', props: { text: 'Major Product Update', fontSize: 28, bold: true, color: '#0d1b2e', alignment: 'left' } },
      { id: uuidv4(), type: 'subtitle', props: { text: 'Everything you need to know about the latest changes', fontSize: 15, color: '#5a7a99' } },
      { id: uuidv4(), type: 'accent', props: { color: '#5A8DE3', width: 80 } },
      { id: uuidv4(), type: 'body', props: { text: 'We are excited to share a significant update to the platform. This release includes major improvements across performance, usability, and new capabilities.', fontSize: 15, color: '#2c3e55' } },
      { id: uuidv4(), type: 'image', props: { url: '', caption: 'Product screenshot or hero image', height: 240 } },
      { id: uuidv4(), type: 'quote', props: { text: 'This is the biggest update we have shipped this quarter — and it directly addresses the top 3 user requests.', attribution: 'Product Team', color: '#5A8DE3' } },
      { id: uuidv4(), type: 'features', props: { sectionTitle: 'Key Highlights', items: [{ bold: 'Performance', text: '2x faster dashboard load times' }, { bold: 'New Filters', text: 'Advanced segmentation across all reports' }, { bold: 'Integrations', text: 'Connect with Slack and Teams in one click' }] } },
      { id: uuidv4(), type: 'numbered', props: { sectionTitle: 'Getting Started', items: [{ text: 'Log in to the updated dashboard' }, { text: 'Explore the new filters panel on the left' }, { text: 'Set up your Slack integration in Settings' }] } },
      { id: uuidv4(), type: 'button', props: { text: 'Explore Now →', url: '#', color: '#5A8DE3', alignment: 'center' } },
      { id: uuidv4(), type: 'whatsnext', props: { sectionTitle: "What's Next", items: [{ bold: 'API Access', badge: 'Coming Soon', text: 'Programmatic access to all reports' }, { bold: 'Custom Dashboards', badge: 'Q2 2026', text: 'Build your own views from any data source' }] } },
      { id: uuidv4(), type: 'closing', props: { text: 'Have questions? Hit reply — we are happy to help.\nYour Product Team', fontSize: 14, color: '#4a6a8a' } },
    ],
  },
];

const STORAGE_KEY = 'release-builder-templates';

export function loadTemplates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_TEMPLATES));
  return [...STARTER_TEMPLATES];
}

export function saveTemplate(template) {
  const templates = loadTemplates();
  templates.unshift({ ...template, id: uuidv4(), created_at: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return templates;
}

export function deleteTemplate(id) {
  const templates = loadTemplates().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return templates;
}
