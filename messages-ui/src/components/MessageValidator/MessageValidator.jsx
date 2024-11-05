import { useState } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Select, 
  Button, 
  Input, 
  Alert,
  theme,
  Divider 
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MessageValidator = () => {
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const { token } = theme.useToken();

  const validateMessage = async () => {
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
        body: message,
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

  const renderResponse = () => {
    if (success) {
      return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message={success}
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
          {parsedResponse && (
            <>
              <Divider orientation="left">
                <Text type="secondary">Parsed Message</Text>
              </Divider>
              <div
                style={{
                  padding: '12px',
                  borderRadius: token.borderRadius,
                  background: token.colorFillAlter,
                  border: `1px solid ${token.colorBorder}`,
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    color: token.colorText,
                  }}
                >
                  {JSON.stringify(parsedResponse, null, 2)}
                </pre>
              </div>
            </>
          )}
        </Space>
      );
    }

    if (errors.length > 0) {
      return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {errors.map((error, index) => (
            <Alert
              key={index}
              message={error}
              type="error"
              showIcon
            />
          ))}
        </Space>
      );
    }

    return null;
  };

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <Title level={3} style={{ color: token.colorText, margin: '8px 0' }}>
          Payment Message Validator
        </Title>
        
        <Card 
          bordered={false}
          style={{ 
            background: token.colorBgContainer,
          }}
        >
          <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
            <Space>
              <Select
                placeholder="Select Message Type"
                style={{ 
                  width: 200,
                }}
                dropdownStyle={{
                  zIndex: 1000
                }}
                value={messageType}
                onChange={(value) => {
                  setMessageType(value);
                  setErrors([]);
                  setSuccess(null);
                  setParsedResponse(null);
                }}
                options={[
                  { value: 'fednow', label: 'FedNow' },
                  { value: 'iso20022', label: 'ISO20022' },
                ]}
              />
              
              <Button
                type="primary"
                onClick={validateMessage}
                loading={isValidating}
                disabled={!messageType || !message}
              >
                Validate
              </Button>
            </Space>

            <TextArea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors([]);
                setSuccess(null);
                setParsedResponse(null);
              }}
              placeholder="Paste your XML message here..."
              rows={15}
              style={{ 
                fontFamily: 'monospace',
                backgroundColor: token.colorBgContainer,
                borderColor: token.colorBorder,
              }}
            />

            {(success || errors.length > 0) && (
              <div style={{ marginTop: '16px' }}>
                {renderResponse()}
              </div>
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default MessageValidator;