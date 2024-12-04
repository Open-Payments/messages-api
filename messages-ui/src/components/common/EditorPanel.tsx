import { Button, ButtonProps } from 'antd';
import Editor from '@monaco-editor/react';
import EditorContainer from '../Layout/common/EditorContainer';
import { theme } from 'antd';
import { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { MonacoConfig } from '../../config/monacoConfig';

interface ButtonConfig extends ButtonProps {
  label: string;
}
interface EditorPanelProps {
  buttons?: ButtonConfig[];
  sampleMessage: string;
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
  monacoConfig: MonacoConfig;
  height?:number;
}

const EditorPanel = ({
  buttons = [],
  sampleMessage,
  handleEditorDidMount,
  monacoConfig,
  height
}: EditorPanelProps) => {
  const { token } = theme.useToken();
  const config = {
    editor: {
      ...monacoConfig.editor,
      theme: token.colorBgContainer === '#ffffff' ? 'light' : 'vs-dark',
    },
  };
  return (
    <EditorContainer
    height={height}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          {buttons.map((button, index) => (
            <Button
              key={index}
              type={button.type}
              onClick={button.onClick}
              loading={button.loading}
            >
              {button.label}
            </Button>
          ))}
        </div>
      }
    >
      <Editor
        height={config.editor.height}
        defaultLanguage={config.editor.defaultLanguage}
        defaultValue={sampleMessage}
        theme={config.editor.theme}
        options={config.editor.options}
        onMount={handleEditorDidMount}
      />
    </EditorContainer>
  );
};

export default EditorPanel;