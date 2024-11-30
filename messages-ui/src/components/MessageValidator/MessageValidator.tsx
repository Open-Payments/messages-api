import { useState, useRef } from 'react';
import { Typography, Row, Col } from 'antd';
import { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useMonaco } from '@monaco-editor/react';
import { theme } from 'antd';
import PageContainer from '../Layout/common/PageContainer';
import ContentCard from '../Layout/common/ContentCard';
import EditorPanel from '../../components/common/EditorPanel';
import ResultsPanel from '../common/ResultsPanel';
const { Title } = Typography;

interface MessageValidatorProps {
  messageType: string;
}
interface ValidationError {
  message: string;
}
interface ParsedResponse {
  content: string;
  validations: Array<{
    field: string;
    message: string;
  }>;
}

interface XMLLanguageConfig {
  defaultToken: string;
  tokenPostfix: string;
  tokenizer: {
    root: Array<[RegExp, string]>;
  };
}
const MessageValidator = ({ messageType }: MessageValidatorProps) => {
  const { token } = theme.useToken();
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [parsedResponse, setParsedResponse] = useState<ParsedResponse | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monaco = useMonaco();
  // Configure Monaco XML support when the editor is loaded
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;

    // Add XML language features if not already registered
    if (!monaco.languages.getLanguages().some(({ id }) => id === 'xml')) {
      monaco.languages.register({ id: 'xml' });
      const monarchRules: XMLLanguageConfig = {
        defaultToken: '',
        tokenPostfix: '.xml',
        tokenizer: {
          root: [
            [/[<&]/, 'delimiter'],
            [/[>]/, 'delimiter'],
            [/[\w\-:]+/, 'tag'],
            [/"[^"]*"/, 'attribute.value'],
            [/'[^']*'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/[\s\r\n]+/, ''],
          ],
        },
      };
      monaco.languages.setMonarchTokensProvider('xml', monarchRules);
    }
  };

  const validateMessage = async () => {
    if (!editorRef.current) return;
    const xmlContent = editorRef.current.getValue();
    if (!xmlContent.trim()) return;
    setIsValidating(true);
    setErrors([]);
    setSuccess(null);
    setParsedResponse(null);

    try {
      const response = await fetch('/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
          'Message-Type': messageType,
        },
        body: xmlContent,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(Array.isArray(data) ? data : [data.message]);
      } else {
        setSuccess('Message validation successful');
        setParsedResponse(data);
      }
    } catch (error) {
      setErrors(['Failed to validate message. Please try again.']);
    } finally {
      setIsValidating(false);
    }
  };

  const sampleMessage =
    messageType === 'iso20022'
      ? `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <!-- Add your ISO20022 message content here -->
</Document>`
      : `<?xml version="1.0" encoding="UTF-8"?>
<FedNowMessage>
  <!-- Add your FedNow message content here -->
</FedNowMessage>`;

  return (
    <PageContainer
      title={
        <Title level={3} style={{ margin: '8px 0' }}>
          {messageType === 'iso20022' ? 'ISO20022' : 'FedNow'} Message Validator
        </Title>
      }
    >
      <ContentCard>
        <Row gutter={16}>
          <Col span={12}>
            <EditorPanel
              onValidate={validateMessage}
              onLoadSample={() => editorRef.current?.setValue(sampleMessage)}
              sampleMessage={sampleMessage}
              isValidating={isValidating}
              handleEditorDidMount={handleEditorDidMount}
            />
          </Col>
          <Col span={12}>
            <ResultsPanel success={success} errors={errors} parsedResponse={parsedResponse} />
          </Col>
        </Row>
      </ContentCard>
    </PageContainer>
  );
};

export default MessageValidator;