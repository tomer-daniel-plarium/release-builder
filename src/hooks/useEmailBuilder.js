import { useReducer, useCallback } from 'react';
import { createComponent, deepCloneComponent } from '../data/defaults';
import { DEFAULT_APPS } from '../data/apps';
import { STARTER_TEMPLATES } from '../data/templates';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

const APPS_STORAGE_KEY = 'release-builder-apps';

function cloneTemplateComponents(components) {
  return components.map(c => ({
    ...JSON.parse(JSON.stringify(c)),
    id: uuidv4(),
  }));
}

function loadApps() {
  try {
    const stored = localStorage.getItem(APPS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return DEFAULT_APPS;
}

function persistApps(apps) {
  try { localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps)); } catch (e) { /* quota/disabled */ }
}

const starterComponents = STARTER_TEMPLATES[0]
  ? cloneTemplateComponents(STARTER_TEMPLATES[0].components)
  : [];

const initialState = {
  apps: loadApps(),
  selectedAppId: 'lab360',
  components: starterComponents,
  selectedComponentId: null,
  viewMode: 'desktop',
  previewMode: false,
  headerTagline: 'Release Notes',
  senderEmail: '',
};

function builderReducer(state, action) {
  switch (action.type) {
    case 'SELECT_APP':
      return { ...state, selectedAppId: action.id, components: [], selectedComponentId: null };

    case 'ADD_COMPONENT': {
      const comp = createComponent(action.componentType);
      if (!comp) return state;
      const idx = action.index ?? state.components.length;
      const next = [...state.components];
      next.splice(idx, 0, comp);
      return { ...state, components: next, selectedComponentId: comp.id };
    }

    case 'REMOVE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(c => c.id !== action.id),
        selectedComponentId: state.selectedComponentId === action.id ? null : state.selectedComponentId,
      };

    case 'DUPLICATE_COMPONENT': {
      const srcIdx = state.components.findIndex(c => c.id === action.id);
      if (srcIdx === -1) return state;
      const clone = deepCloneComponent(state.components[srcIdx]);
      const next = [...state.components];
      next.splice(srcIdx + 1, 0, clone);
      return { ...state, components: next, selectedComponentId: clone.id };
    }

    case 'MOVE_COMPONENT': {
      const { oldIndex, newIndex } = action;
      return { ...state, components: arrayMove(state.components, oldIndex, newIndex) };
    }

    case 'MOVE_UP': {
      const idx = state.components.findIndex(c => c.id === action.id);
      if (idx <= 0) return state;
      return { ...state, components: arrayMove(state.components, idx, idx - 1) };
    }

    case 'MOVE_DOWN': {
      const idx = state.components.findIndex(c => c.id === action.id);
      if (idx === -1 || idx >= state.components.length - 1) return state;
      return { ...state, components: arrayMove(state.components, idx, idx + 1) };
    }

    case 'SELECT_COMPONENT':
      return { ...state, selectedComponentId: action.id };

    case 'DESELECT':
      return { ...state, selectedComponentId: null };

    case 'UPDATE_PROPS': {
      return {
        ...state,
        components: state.components.map(c =>
          c.id === action.id ? { ...c, props: { ...c.props, ...action.props } } : c
        ),
      };
    }

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.mode };

    case 'TOGGLE_PREVIEW':
      return { ...state, previewMode: !state.previewMode, selectedComponentId: null };

    case 'LOAD_TEMPLATE':
      return {
        ...state,
        components: action.components.map(c => ({ ...c })),
        selectedAppId: action.appId || state.selectedAppId,
        selectedComponentId: null,
      };

    case 'SET_HEADER_TAGLINE':
      return { ...state, headerTagline: action.value };

    case 'SET_SENDER_EMAIL':
      return { ...state, senderEmail: action.value };

    case 'UPDATE_APPS': {
      persistApps(action.apps);
      return { ...state, apps: action.apps };
    }

    case 'SET_FULL_STATE':
      return { ...action.state };

    default:
      return state;
  }
}

const MAX_HISTORY = 50;

function useUndoable(reducer, init) {
  const undoableReducer = useCallback((historyState, action) => {
    if (action.type === 'UNDO') {
      if (historyState.past.length === 0) return historyState;
      const prev = historyState.past[historyState.past.length - 1];
      return {
        past: historyState.past.slice(0, -1),
        present: prev,
        future: [historyState.present, ...historyState.future],
      };
    }
    if (action.type === 'REDO') {
      if (historyState.future.length === 0) return historyState;
      const next = historyState.future[0];
      return {
        past: [...historyState.past, historyState.present],
        present: next,
        future: historyState.future.slice(1),
      };
    }

    const newPresent = reducer(historyState.present, action);
    if (newPresent === historyState.present) return historyState;

    const skipHistory = action.type === 'SELECT_COMPONENT' || action.type === 'DESELECT'
      || action.type === 'SET_VIEW_MODE' || action.type === 'TOGGLE_PREVIEW'
      || action.type === 'SET_HEADER_TAGLINE' || action.type === 'SET_SENDER_EMAIL';

    if (skipHistory) {
      return { ...historyState, present: newPresent };
    }

    return {
      past: [...historyState.past.slice(-MAX_HISTORY), historyState.present],
      present: newPresent,
      future: [],
    };
  }, [reducer]);

  const [history, dispatch] = useReducer(undoableReducer, {
    past: [],
    present: init,
    future: [],
  });

  return [history.present, dispatch, history.past.length > 0, history.future.length > 0];
}

export function useEmailBuilder() {
  const [state, dispatch, canUndo, canRedo] = useUndoable(builderReducer, initialState);

  const selectedApp = state.apps.find(a => a.id === state.selectedAppId) || state.apps[0];
  const selectedComponent = state.components.find(c => c.id === state.selectedComponentId) || null;

  return { state, dispatch, selectedApp, selectedComponent, canUndo, canRedo };
}
