import React, { useState, useRef } from 'react';
import { Typography, Row, Col } from 'antd';
import { editor } from 'monaco-editor';
import PageContainer from '../Layout/common/PageContainer';
import ContentCard from '../Layout/common/ContentCard';
import EditorPanel from '../common/EditorPanel';
import { RULE_LOGIC_SAMPLES } from '../../constants/samples/ruleLogic';
import ResultsPanel from '../common/ResultsPanel';
import { DEFAULT_MONACO_CONFIG, MonacoConfig } from '../../config/monacoConfig';

const rulesEditorConfig: MonacoConfig = {
  editor: {
    ...DEFAULT_MONACO_CONFIG.editor,
    defaultLanguage: 'json',
    options: {
      ...DEFAULT_MONACO_CONFIG.editor.options,
      tabSize: 2,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
    },
  },
};

const dataEditorConfig: MonacoConfig = {
  editor: {
    ...DEFAULT_MONACO_CONFIG.editor,
    defaultLanguage: 'json',
    options: {
      ...DEFAULT_MONACO_CONFIG.editor.options,
      tabSize: 2,
      wordWrap: 'on',
      readOnly: false,
    },
  },
};
function RuleLogic() {
  const { Title } = Typography;
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [parsedResponse, setParsedResponse] = useState<any | null>(null);
  const rulesEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const dataEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleRulesEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    rulesEditorRef.current = editor;
  };

  const handleDataEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    dataEditorRef.current = editor;
  };

  const applyLogic = async () => {
    if (!rulesEditorRef.current || !dataEditorRef.current) return;

    setIsValidating(true);
    setErrors([]);
    setSuccess(null);
    setParsedResponse(null);
    try {
      const rules = JSON.parse(rulesEditorRef.current.getValue());
      const data = JSON.parse(dataEditorRef.current.getValue());
      const response = await fetch('/apply_logic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules, data }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setErrors(responseData.errors || ['Server error occurred']);
        return;
      }
      setSuccess('Logic Validation successful');
      setParsedResponse(responseData);
    } catch (error: any) {
      setErrors([error.message]);
    } finally {
      setIsValidating(false);
    }
  };
  const handleLoadSample = () => {
    if (rulesEditorRef.current) {
      rulesEditorRef.current.setValue(RULE_LOGIC_SAMPLES.rules);
    }
    if (dataEditorRef.current) {
      dataEditorRef.current.setValue(RULE_LOGIC_SAMPLES.data);
    }
  };
  return (
    <PageContainer
      title={
        <Title level={3} style={{ margin: '8px 0' }}>
          Logic Engine
        </Title>
      }
    >
      <ContentCard>
        <Row gutter={16}>
          <Col span={12}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Title level={4}>Logic</Title>
                <EditorPanel
                  buttons={[
                    {
                      type: 'primary',
                      label: 'Apply',
                      onClick: applyLogic,
                      loading: isValidating,
                    },
                    {
                      type: 'default',
                      label: 'Load Sample',
                      onClick: handleLoadSample,
                    },
                  ]}
                  sampleMessage={RULE_LOGIC_SAMPLES.rules}
                  handleEditorDidMount={handleRulesEditorMount}
                  monacoConfig={rulesEditorConfig}
                />
              </Col>
              <Col span={24}>
                <Title level={4}>Data</Title>
                <EditorPanel
                  sampleMessage={RULE_LOGIC_SAMPLES.data}
                  handleEditorDidMount={handleDataEditorMount}
                  monacoConfig={dataEditorConfig}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <ResultsPanel title='Result' success={success} errors={errors} parsedResponse={parsedResponse} />
          </Col>
        </Row>
      </ContentCard>
    </PageContainer>
  );
}

export default RuleLogic;
