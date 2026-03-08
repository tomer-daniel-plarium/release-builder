import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BlockRenderer, { EmailHeader, EmailFooter } from './BlockRenderer';

function SortableBlock({ component, isSelected, dispatch }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    data: { origin: 'canvas', component },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={e => { e.stopPropagation(); dispatch({ type: 'SELECT_COMPONENT', id: component.id }); }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        outline: isSelected ? '2px solid #5A8DE3' : '2px solid transparent',
        borderRadius: 4, cursor: 'pointer', marginBottom: 2,
      }}
    >

      {isSelected && (
        <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10, display: 'flex', gap: 2, padding: 2, background: 'rgba(13,27,46,0.85)', borderRadius: '0 4px 0 4px' }}>
          {[['↑', 'MOVE_UP'], ['↓', 'MOVE_DOWN'], ['⧉', 'DUPLICATE_COMPONENT']].map(([label, action]) => (
            <button key={label} onClick={e => { e.stopPropagation(); dispatch({ type: action, id: component.id }); }}
              style={{ background: 'transparent', color: '#fff', border: 'none', borderRadius: 3, padding: '2px 5px', fontSize: 12, cursor: 'pointer' }}>{label}</button>
          ))}
          <button onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_COMPONENT', id: component.id }); }}
            style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 3, padding: '2px 5px', fontSize: 12, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <BlockRenderer component={component} />
    </div>
  );
}

const InsertLine = () => (
  <div style={{ height: 3, background: '#5A8DE3', borderRadius: 2, margin: '4px 0', boxShadow: '0 0 6px rgba(90,141,227,0.5)' }} />
);

export default function Canvas({ app, components, selectedComponentId, viewMode, dispatch, headerTagline, senderEmail, insertIndicatorIdx }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop' });
  const width = viewMode === 'mobile' ? 390 : 600;

  return (
    <div
      className="flex-1 overflow-auto bg-[#f0f2f5]"
      onClick={() => dispatch({ type: 'DESELECT' })}
    >
      <div style={{ padding: '20px 16px', minHeight: '100%' }}>
        <div style={{ width, maxWidth: '100%', margin: '0 auto', transition: 'width 0.3s' }}>
          <div
            ref={setNodeRef}
            className={isOver ? 'ring-2 ring-dashed ring-[#5A8DE3]' : ''}
            style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}
          >
            <EmailHeader app={app} tagline={headerTagline} />

            <div style={{ background: '#fff', padding: viewMode === 'mobile' ? '24px 20px' : '32px 40px 8px' }}
              onClick={e => e.stopPropagation()}>
              {components.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#bbb', fontSize: 13, border: '2px dashed #c8d9f0', borderRadius: 8, margin: '0 auto' }}>
                  ← Drag a component from the left panel to get started
                </div>
              ) : (
                <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div>
                    {components.map((c, i) => (
                      <div key={c.id}>
                        {insertIndicatorIdx === i && <InsertLine />}
                        <SortableBlock
                          component={c}
                          isSelected={c.id === selectedComponentId}
                          dispatch={dispatch}
                        />
                      </div>
                    ))}
                    {insertIndicatorIdx === components.length && <InsertLine />}
                  </div>
                </SortableContext>
              )}
            </div>

            <EmailFooter app={app} senderEmail={senderEmail} />
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#bbb', marginTop: 10 }}>
            Click a component to edit · Drag to reorder · Drop from palette to add
          </p>
        </div>
      </div>
    </div>
  );
}
