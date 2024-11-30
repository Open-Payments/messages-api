import { Button } from 'antd';
import Editor from '@monaco-editor/react';
import EditorContainer from '../Layout/common/EditorContainer';

interface EditorPanelProps {
  onValidate: () => void;
  onLoadSample: () => void;
  sampleMessage: string;
  isValidating: boolean;
  handleEditorDidMount: (editor: any, monaco: any) => void;
}

const EditorPanel = ({
  onValidate,
  onLoadSample,
  sampleMessage,
  isValidating,
  handleEditorDidMount,
}: EditorPanelProps) => (
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

export default EditorPanel;
