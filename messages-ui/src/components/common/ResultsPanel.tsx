
import { Alert, Divider, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { theme } from 'antd';

const { Text } = Typography;

interface ResultsPanelProps {
  success: string | null;
  errors: string[];
  parsedResponse: any;
}

 const ResultsPanel = ({ success, errors, parsedResponse }: ResultsPanelProps) => {
  const { token } = theme.useToken();
  
  if (!success && errors.length === 0) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorTextSecondary,
      }}>
        Validation results will appear here
      </div>
    );
  }

  return (
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
  );
};

export default ResultsPanel;