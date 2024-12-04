import { theme } from 'antd';
import { ReactNode } from 'react';

interface EditorContainerProps {
  children: ReactNode;
  height?: number;
  actions?: ReactNode;
}

const EditorContainer = ({ children, height = 600, actions }: EditorContainerProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    {actions && (
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {actions}
      </div>
    )}
    <div
      style={{
        border: `1px solid ${theme.useToken().token.colorBorder}`,
        borderRadius: theme.useToken().token.borderRadius,
        overflow: 'hidden',
        height,
      }}
    >
      {children}
    </div>
  </div>
);
export default EditorContainer;