import { useState, useEffect, useCallback } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useEmailBuilder } from './hooks/useEmailBuilder';
import { generateEmailHtml } from './utils/exportHtml';
import { getPlaceholderSvg } from './utils/svgConverter';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import Toast from './components/Toast';
import TemplatesModal from './components/TemplatesModal';
import ManageAppsModal from './components/ManageAppsModal';
import BlockRenderer, { EmailHeader, EmailFooter } from './components/BlockRenderer';

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

export default function App() {
  const { state, dispatch, selectedApp, selectedComponent, canUndo, canRedo } = useEmailBuilder();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [manageAppsOpen, setManageAppsOpen] = useState(false);

  const displayApp = {
    ...selectedApp,
    svgRaw: selectedApp.svgRaw || getPlaceholderSvg(selectedApp.name),
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => setToastVisible(false), []);

  const handleCopyHtml = useCallback(() => {
    const html = generateEmailHtml(displayApp, state.components, { headerTagline: state.headerTagline, senderEmail: state.senderEmail });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(html)
        .then(() => showToast('✅ HTML copied to clipboard!'))
        .catch(() => {
          fallbackCopy(html);
          showToast('✅ HTML copied to clipboard!');
        });
    } else {
      fallbackCopy(html);
      showToast('✅ HTML copied to clipboard!');
    }
  }, [displayApp, state.components, state.headerTagline, state.senderEmail, showToast]);

  const handleDownloadHtml = useCallback(() => {
    const html = generateEmailHtml(displayApp, state.components, { headerTagline: state.headerTagline, senderEmail: state.senderEmail });
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${displayApp.name.toLowerCase().replace(/\s+/g, '-')}-release-note.html`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('✅ HTML file downloaded!');
  }, [displayApp, state.components, state.headerTagline, state.senderEmail, showToast]);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset canvas? This will clear all components.')) {
      dispatch({ type: 'LOAD_TEMPLATE', components: [], appId: state.selectedAppId });
    }
  }, [dispatch, state.selectedAppId]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  const [insertIndicatorIdx, setInsertIndicatorIdx] = useState(null);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!active?.data.current || active.data.current.origin !== 'palette') {
      setInsertIndicatorIdx(null);
      return;
    }
    if (!over) { setInsertIndicatorIdx(null); return; }
    if (over.id === 'canvas-drop') {
      setInsertIndicatorIdx(state.components.length);
    } else {
      const idx = state.components.findIndex(c => c.id === over.id);
      setInsertIndicatorIdx(idx !== -1 ? idx : state.components.length);
    }
  }, [state.components]);

  const handleDragEnd = useCallback((event) => {
    setInsertIndicatorIdx(null);
    const { active, over } = event;
    if (!active) return;

    const data = active.data.current;

    if (data?.origin === 'palette' && over) {
      let index = state.components.length;
      if (over.id !== 'canvas-drop') {
        const overIdx = state.components.findIndex(c => c.id === over.id);
        if (overIdx !== -1) index = overIdx;
      }
      dispatch({ type: 'ADD_COMPONENT', componentType: data.componentType, index });
      return;
    }

    if (data?.origin !== 'palette' && over && active.id !== over.id) {
      const oldIndex = state.components.findIndex(c => c.id === active.id);
      const newIndex = state.components.findIndex(c => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch({ type: 'MOVE_COMPONENT', oldIndex, newIndex });
      }
    }
  }, [dispatch, state.components]);

  if (state.previewMode) {
    const width = state.viewMode === 'mobile' ? 390 : 600;
    return (
      <div className="h-screen flex flex-col bg-[#0d1b2e]">
        <TopBar
          apps={state.apps} selectedApp={selectedApp} dispatch={dispatch}
          viewMode={state.viewMode} previewMode={state.previewMode}
          onCopyHtml={handleCopyHtml} onDownloadHtml={handleDownloadHtml}
          onReset={handleReset} onOpenTemplates={() => setTemplatesOpen(true)}
          canUndo={canUndo} canRedo={canRedo}
        />
        <div className="flex-1 overflow-auto bg-[#f0f2f5]">
          <div className="flex justify-center py-8 px-4">
            <div style={{ width, maxWidth: width }} className="bg-white rounded-xl overflow-hidden shadow-xl">
              <EmailHeader app={displayApp} tagline={state.headerTagline} />
              <div style={{ padding: state.viewMode === 'mobile' ? '24px 20px' : '32px 40px 8px' }}>
                {state.components.map(c => <BlockRenderer key={c.id} component={c} />)}
              </div>
              <EmailFooter app={displayApp} senderEmail={state.senderEmail} />
            </div>
          </div>
        </div>
        <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col">
        <TopBar
          apps={state.apps} selectedApp={selectedApp} dispatch={dispatch}
          viewMode={state.viewMode} previewMode={state.previewMode}
          onCopyHtml={handleCopyHtml} onDownloadHtml={handleDownloadHtml}
          onReset={handleReset} onOpenTemplates={() => setTemplatesOpen(true)}
          canUndo={canUndo} canRedo={canRedo}
        />
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel
            apps={state.apps}
            selectedAppId={state.selectedAppId}
            dispatch={dispatch}
            onManageApps={() => setManageAppsOpen(true)}
            headerTagline={state.headerTagline}
            senderEmail={state.senderEmail}
          />
          <Canvas
            app={displayApp}
            components={state.components}
            selectedComponentId={state.selectedComponentId}
            viewMode={state.viewMode}
            dispatch={dispatch}
            headerTagline={state.headerTagline}
            senderEmail={state.senderEmail}
            insertIndicatorIdx={insertIndicatorIdx}
          />
          {selectedComponent && (
            <RightPanel component={selectedComponent} dispatch={dispatch} />
          )}
        </div>
      </div>

      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
      <TemplatesModal
        isOpen={templatesOpen} onClose={() => setTemplatesOpen(false)}
        currentAppId={state.selectedAppId} components={state.components}
        apps={state.apps} dispatch={dispatch}
      />
      <ManageAppsModal
        isOpen={manageAppsOpen} onClose={() => setManageAppsOpen(false)}
        apps={state.apps} dispatch={dispatch}
      />
    </DndContext>
  );
}
