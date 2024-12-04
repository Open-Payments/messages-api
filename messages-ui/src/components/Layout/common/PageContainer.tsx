import { Space } from 'antd';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: ReactNode;
}

const PageContainer = ({ children, title }: PageContainerProps) => (
  <Space direction="vertical" size="large" style={{ display: 'flex', width: '100%' }}>
    {title}
    {children}
  </Space>
);

export default PageContainer;