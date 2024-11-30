import { Button } from 'antd';
import Editor from '@monaco-editor/react';
import EditorContainer from '../Layout/common/EditorContainer';
import { theme } from 'antd';
import { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
interface EditorPanelProps {
  onValidate: () => void;
  onLoadSample: () => void;
  sampleMessage: string;
  isValidating: boolean;
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
}

const EditorPanel = ({
  onValidate,
  onLoadSample,
  sampleMessage,
  isValidating,
  handleEditorDidMount,
}: EditorPanelProps) => {
  const { token } = theme.useToken();
  return (
    <EditorContainer
      actions={
        <>
          <Button type="primary" onClick={onValidate} loading={isValidating}>
            Validate
          </Button>
          <Button onClick={onLoadSample}>Load Sample</Button>
        </>
      }
    >
      <Editor
        height="100%"
        defaultLanguage="xml"
        defaultValue={sampleMessage}
        theme={token.colorBgContainer === '#ffffff' ? 'light' : 'vs-dark'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          formatOnType: true,
          formatOnPaste: true,
        }}
        onMount={handleEditorDidMount}
      />
    </EditorContainer>
  );
};

export default EditorPanel;
