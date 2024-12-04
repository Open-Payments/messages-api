import { editor } from 'monaco-editor';

export interface MonacoConfig {
  editor: {
    defaultLanguage: string;
    theme: 'light' | 'vs-dark' | string;
    height: string;
    options: editor.IStandaloneEditorConstructionOptions;
  };
}

export const DEFAULT_MONACO_CONFIG: MonacoConfig = {
  editor: {
    defaultLanguage: 'xml',
    theme: 'light',
    height: '100%',
    options: {
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      automaticLayout: true,
      formatOnType: true,
      formatOnPaste: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      renderWhitespace: 'all',
      quickSuggestions: true,
      folding: true,
      scrollbar: {
        vertical: 'visible',
        verticalScrollbarSize: 10,
        alwaysConsumeMouseWheel: false,
      },
      fixedOverflowWidgets: true,
    },
  },
};