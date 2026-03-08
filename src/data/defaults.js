import { v4 as uuidv4 } from 'uuid';

export const COMPONENT_TYPES = [
  { type: 'tag', label: 'Tag', icon: '🏷️' },
  { type: 'title', label: 'Title', icon: '𝐇' },
  { type: 'subtitle', label: 'Subtitle', icon: '𝑖' },
  { type: 'accent', label: 'Accent Line', icon: '—' },
  { type: 'body', label: 'Body Text', icon: '¶' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'features', label: 'Features', icon: '•' },
  { type: 'button', label: 'Button', icon: '▢' },
  { type: 'whatsnext', label: "What's Next", icon: '→' },
  { type: 'quote', label: 'Quote', icon: '❝' },
  { type: 'version', label: 'Version', icon: '#' },
  { type: 'numbered', label: 'Steps', icon: '1.' },
  { type: 'divider', label: 'Divider', icon: '―' },
  { type: 'spacer', label: 'Spacer', icon: '↕' },
  { type: 'closing', label: 'Closing', icon: '✉' },
];

const DEFAULT_PROPS = {
  tag: { text: 'New Feature', emoji: '🚀' },
  title: { text: 'Your Feature Title Here', fontSize: 26, bold: true, color: '#0d1b2e', alignment: 'left' },
  subtitle: { text: 'Subtitle — describe this release briefly', fontSize: 15, color: '#5a7a99' },
  accent: { color: '#5A8DE3', width: 60 },
  body: { text: 'Describe your feature here. Keep it concise and impactful.', fontSize: 15, color: '#2c3e55' },
  image: { url: '', caption: 'Replace with your screenshot', height: 180 },
  features: {
    sectionTitle: 'Key Features',
    items: [
      { bold: 'Feature one', text: 'Description here.' },
      { bold: 'Feature two', text: 'Description here.' },
    ],
  },
  button: { text: 'Click Here →', url: '#', color: '#5A8DE3', alignment: 'center' },
  whatsnext: {
    sectionTitle: "What's Next?",
    items: [
      { bold: 'Upcoming Feature', badge: 'Coming Soon', text: 'Brief description here.' },
    ],
  },
  quote: { text: 'This is a key insight or testimonial that deserves attention.', attribution: '', color: '#5A8DE3' },
  version: { version: 'v1.0.0', date: 'March 2026', alignment: 'left' },
  numbered: {
    sectionTitle: 'How To Get Started',
    items: [
      { text: 'First step — description here.' },
      { text: 'Second step — description here.' },
    ],
  },
  divider: { color: '#c8d9f0', thickness: 1 },
  spacer: { height: 24 },
  closing: { text: "We're excited!\nFor any questions, feel free to reach out.", fontSize: 14, color: '#4a6a8a' },
};

export function createComponent(type) {
  if (!DEFAULT_PROPS[type]) return null;
  return {
    id: uuidv4(),
    type,
    props: { ...DEFAULT_PROPS[type] },
  };
}

export function deepCloneComponent(component) {
  return {
    ...JSON.parse(JSON.stringify(component)),
    id: uuidv4(),
  };
}
