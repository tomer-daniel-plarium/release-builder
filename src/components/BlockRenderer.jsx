import { convertSvgToBlue, scaleSvg } from '../utils/svgConverter';
import { B, N1, N2, LBG, BDR, ff } from '../data/theme';
import { HEADER_HEX_SVG } from '../data/hexPattern';

function SvgIcon({ svgRaw, w, h, centered = false }) {
  if (!svgRaw) return null;
  let html = scaleSvg(convertSvgToBlue(svgRaw), w, h);
  if (centered) {
    html = html.replace('<svg ', '<svg style="display:block;margin:0 auto;" ');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span style={{ display: 'inline-block', verticalAlign: 'middle' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

function TagBlock({ props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{
        display: 'inline-block', background: LBG, color: B, fontSize: 11, fontWeight: 700,
        letterSpacing: 2, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, fontFamily: ff,
      }}>{props.emoji} {props.text}</span>
    </div>
  );
}

function TitleBlock({ props }) {
  return (
    <h1 style={{
      fontSize: props.fontSize || 26, fontWeight: props.bold ? 800 : 400,
      color: props.color || N1, lineHeight: 1.25, margin: '0 0 10px',
      textAlign: props.alignment || 'left', fontFamily: ff,
    }}>{props.text}</h1>
  );
}

function SubtitleBlock({ props }) {
  return (
    <p style={{
      fontSize: props.fontSize || 15, color: props.color || '#5a7a99',
      fontStyle: 'italic', margin: '0 0 22px', lineHeight: 1.5, fontFamily: ff,
    }}>{props.text}</p>
  );
}

function AccentBlock({ props }) {
  return (
    <div style={{
      height: 2, width: props.width || 60,
      background: `linear-gradient(to right, ${props.color || B}, transparent)`,
      margin: '0 0 22px', borderRadius: 2,
    }} />
  );
}

function BodyBlock({ props }) {
  return (
    <p style={{
      fontSize: props.fontSize || 15, color: props.color || '#2c3e55',
      lineHeight: 1.7, margin: '0 0 28px', fontFamily: ff, whiteSpace: 'pre-wrap',
    }}>{props.text}</p>
  );
}

function ImageBlock({ props }) {
  if (props.url) {
    const hasWidth = props.width && props.width > 0;
    const align = props.alignment || 'center';
    const imgStyle = {
      display: 'block',
      maxWidth: '100%',
      borderRadius: hasWidth ? 0 : 10,
    };
    if (hasWidth) {
      imgStyle.width = props.width;
      if (align === 'center') imgStyle.margin = '0 auto';
      else if (align === 'right') imgStyle.marginLeft = 'auto';
    } else {
      imgStyle.width = '100%';
    }

    return (
      <div style={{ marginBottom: 28 }}>
        <img src={props.url} alt={props.caption || ''} style={imgStyle} />
      </div>
    );
  }
  return (
    <div style={{
      background: `linear-gradient(135deg, ${N1}, ${N2})`, borderRadius: 10,
      height: props.height || 180, marginBottom: 28,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: 2,
        textTransform: 'uppercase', fontFamily: ff,
      }}>{props.caption || 'Image placeholder'}</span>
    </div>
  );
}

function Chevron() {
  return (
    <div style={{
      width: 0, height: 0, minWidth: 0, marginTop: 6,
      borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
      borderLeft: `7px solid ${B}`,
    }} />
  );
}

function FeaturesBlock({ props }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {props.sectionTitle && (
        <p style={{
          fontSize: 17, fontWeight: 800, color: N1, margin: '0 0 14px',
          paddingBottom: 10, borderBottom: `1.5px solid ${BDR}`, fontFamily: ff,
        }}>{props.sectionTitle}</p>
      )}
      {(props.items || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
          <Chevron />
          <p style={{ fontSize: 14, color: '#2c3e55', lineHeight: 1.65, margin: 0, fontFamily: ff }}>
            <strong style={{ color: N1 }}>{item.bold}</strong> — {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function ButtonBlock({ props }) {
  return (
    <div style={{ textAlign: props.alignment || 'center', marginBottom: 28 }}>
      <span style={{
        display: 'inline-block', background: props.color || B, color: '#fff',
        fontSize: 15, fontWeight: 700, padding: '10px 50px', borderRadius: 6,
        fontFamily: ff, cursor: 'pointer', letterSpacing: 0.5,
      }}>{props.text}</span>
    </div>
  );
}

function WhatsNextBlock({ props }) {
  return (
    <div style={{
      background: LBG, borderRadius: 10, marginBottom: 28,
      border: `1px solid ${BDR}`, padding: '22px 24px',
    }}>
      {props.sectionTitle && (
        <p style={{
          fontSize: 17, fontWeight: 800, color: N1, margin: '0 0 14px',
          paddingBottom: 10, borderBottom: `1.5px solid ${BDR}`, fontFamily: ff,
        }}>{props.sectionTitle}</p>
      )}
      {(props.items || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
          <Chevron />
          <div style={{ fontSize: 14, color: '#2c3e55', lineHeight: 1.65, fontFamily: ff }}>
            <strong style={{ color: N1 }}>{item.bold}</strong>
            {item.badge && (
              <span style={{
                display: 'inline-block', background: '#dce8fb', color: B,
                fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                padding: '2px 7px', borderRadius: 10, marginLeft: 6, verticalAlign: 'middle',
              }}>{item.badge}</span>
            )}
            <br />{item.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteBlock({ props }) {
  return (
    <div style={{
      borderLeft: `3px solid ${props.color || B}`, background: '#f8fafd',
      padding: '16px 20px', marginBottom: 28, borderRadius: '0 8px 8px 0',
    }}>
      <p style={{
        fontSize: 15, fontStyle: 'italic', color: '#2c3e55',
        lineHeight: 1.7, margin: 0, fontFamily: ff,
      }}>{props.text}</p>
      {props.attribution && (
        <p style={{
          fontSize: 12, color: '#5a7a99', margin: '10px 0 0', fontFamily: ff,
        }}>— {props.attribution}</p>
      )}
    </div>
  );
}

function VersionBlock({ props }) {
  return (
    <div style={{ textAlign: props.alignment || 'left', marginBottom: 20 }}>
      <span style={{
        display: 'inline-block', background: LBG, color: B,
        fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20,
        fontFamily: ff, letterSpacing: 0.5,
      }}>{props.version} — {props.date}</span>
    </div>
  );
}

function NumberedBlock({ props }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {props.sectionTitle && (
        <p style={{
          fontSize: 17, fontWeight: 800, color: N1, margin: '0 0 14px',
          paddingBottom: 10, borderBottom: `1.5px solid ${BDR}`, fontFamily: ff,
        }}>{props.sectionTitle}</p>
      )}
      {(props.items || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, minWidth: 22, borderRadius: '50%',
            background: B, color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: ff,
            flexShrink: 0, marginTop: 1,
          }}>{i + 1}</span>
          <p style={{ fontSize: 14, color: '#2c3e55', lineHeight: 1.65, margin: 0, fontFamily: ff }}>
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function DividerBlock({ props }) {
  return (
    <div style={{
      height: props.thickness || 1, background: props.color || BDR, margin: '0 0 20px',
    }} />
  );
}

function SpacerBlock({ props }) {
  return <div style={{ height: props.height || 24 }} />;
}

function ClosingBlock({ props }) {
  return (
    <div style={{ borderTop: '1.5px solid #eef3fb', paddingTop: 20, textAlign: 'center' }}>
      <p style={{
        fontSize: props.fontSize || 14, color: props.color || '#4a6a8a',
        lineHeight: 1.8, margin: 0, fontFamily: ff,
      }}>
        {(props.text || '').split('\n').map((line, i, arr) => (
          <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
        ))}
      </p>
    </div>
  );
}

const RENDERERS = {
  tag: TagBlock,
  title: TitleBlock,
  subtitle: SubtitleBlock,
  accent: AccentBlock,
  body: BodyBlock,
  image: ImageBlock,
  features: FeaturesBlock,
  button: ButtonBlock,
  whatsnext: WhatsNextBlock,
  quote: QuoteBlock,
  version: VersionBlock,
  numbered: NumberedBlock,
  divider: DividerBlock,
  spacer: SpacerBlock,
  closing: ClosingBlock,
};

export default function BlockRenderer({ component }) {
  const Renderer = RENDERERS[component.type];
  if (!Renderer) return null;
  return <Renderer props={component.props} />;
}

export function EmailHeader({ app, tagline = 'Release Notes' }) {
  if (app.headerImage) {
    return (
      <div style={{ borderBottom: `2px solid ${B}`, fontSize: 0, lineHeight: 0 }}>
        <img src={app.headerImage} alt={app.name} style={{ display: 'block', width: '100%', pointerEvents: 'none' }} />
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(135deg, ${N1} 0%, ${N2} 60%, ${N1} 100%)`,
      borderBottom: `2px solid ${B}`,
    }}>
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        dangerouslySetInnerHTML={{ __html: HEADER_HEX_SVG }}
      />
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '24px 40px 28px', textAlign: 'center',
      }}>
        <p style={{ color: B, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 20px', fontFamily: ff }}>
          Data Applications · Midcore District, MTG
        </p>
        {app.svgRaw ? (
          <SvgIcon svgRaw={app.svgRaw} w={110} h={127} centered />
        ) : (
          <div style={{
            width: 100, height: 100, background: 'rgba(90,141,227,0.15)',
            border: `2px solid ${B}`, borderRadius: 8, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: B, fontSize: 32 }}>?</span>
          </div>
        )}
        <p style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: 2, margin: '12px 0 0', fontFamily: ff }}>
          {app.name}
        </p>
        <p style={{ color: B, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', margin: '5px 0 0', fontFamily: ff }}>
          {tagline}
        </p>
      </div>
    </div>
  );
}

export function EmailFooter({ app, senderEmail }) {
  const email = senderEmail || app.email;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${N1}, ${N2})`,
      padding: '28px 40px', textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        {app.svgRaw && <SvgIcon svgRaw={app.svgRaw} w={24} h={28} />}
        <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: 1, fontFamily: ff }}>{app.name}</span>
      </div>
      <p style={{ color: B, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 12px', fontFamily: ff }}>
        Data Applications · Midcore District, MTG
      </p>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 0 12px' }} />
      {email && (
        <a href={`mailto:${email}`} style={{ color: B, fontSize: 12, textDecoration: 'none', fontFamily: ff }}>
          {email}
        </a>
      )}
    </div>
  );
}
