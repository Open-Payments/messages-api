// components/MessageValidator/MessageValidator.jsx
import { useState, useRef } from 'react';
import { Card, Typography, Space, Button, Alert, Divider, Row, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import Editor, { useMonaco } from '@monaco-editor/react';
import { theme } from 'antd';

const { Title, Text } = Typography;

const MessageValidator = ({ messageType }) => {
  const { token } = theme.useToken();
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const editorRef = useRef(null);
  const monaco = useMonaco();

  // Configure Monaco XML support when the editor is loaded
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add XML language features if not already registered
    if (!monaco.languages.getLanguages().some(({ id }) => id === 'xml')) {
      monaco.languages.register({ id: 'xml' });
      monaco.languages.setMonarchTokensProvider('xml', {
        defaultToken: '',
        tokenPostfix: '.xml',
        
        // Regular expressions for tokens
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
      });
    }
  };

  const validateMessage = async () => {
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

  const sampleMessage = messageType === 'iso20022' 
    ? `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <!-- Add your ISO20022 message content here -->
</Document>`
    : `<?xml version="1.0" encoding="UTF-8"?>
<FedNowMessage>
  <!-- Add your FedNow message content here -->
</FedNowMessage>`;

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Title level={3} style={{ margin: '8px 0' }}>
        {messageType === 'iso20022' ? 'ISO20022' : 'FedNow'} Message Validator
      </Title>
      
      <Card bordered={false}>
        <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%' 
              }}>
                <div style={{ 
                  marginBottom: 16, 
                  display: 'flex', 
                  justifyContent: 'space-between' 
                }}>
                  <Button
                    type="primary"
                    onClick={validateMessage}
                    loading={isValidating}
                  >
                    Validate
                  </Button>
                  <Button 
                    onClick={() => {
                      editorRef.current.setValue(sampleMessage);
                    }}
                  >
                    Load Sample
                  </Button>
                </div>
                
                <div style={{ 
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: token.borderRadius,
                  overflow: 'hidden',
                  height: 600 // Fixed height for editor
                }}>
                  <Editor
                    height="100%"
                    defaultLanguage="xml"
                    defaultValue={sampleMessage}
                    theme={token.colorBgContainer === '#ffffff' ? 'light' : 'vs-dark'}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                      formatOnType: true,
                      formatOnPaste: true,
                    }}
                    onMount={handleEditorDidMount}
                  />
                </div>
              </div>
            </Col>
            
            <Col span={12}>
              <div style={{ 
                height: 642, // Matches editor container height (600 + button area)
                overflowY: 'auto',
                border: `1px solid ${token.colorBorder}`,
                borderRadius: token.borderRadius,
                backgroundColor: token.colorBgContainer,
              }}>
                {(success || errors.length > 0) ? (
                  <div style={{ padding: 16 }}>
                    {success && (
                      <Alert
                        message={success}
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                        style={{ marginBottom: 16 }}
                      />
                    )}
                    {errors.map((error, index) => (
                      <Alert
                        key={index}
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                    ))}
                    {parsedResponse && (
                      <>
                        <Divider>
                          <Text type="secondary">Parsed Message</Text>
                        </Divider>
                        <pre
                          style={{
                            margin: 0,
                            padding: 12,
                            fontSize: 13,
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            backgroundColor: token.colorFillTertiary,
                            border: `1px solid ${token.colorBorder}`,
                            borderRadius: token.borderRadius,
                          }}
                        >
                          {JSON.stringify(parsedResponse, null, 2)}
                        </pre>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: token.colorTextSecondary,
                  }}>
                    Validation results will appear here
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Space>
      </Card>
    </Space>
  );
};

export default MessageValidator;