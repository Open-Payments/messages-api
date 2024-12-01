import { Card, Space } from 'antd';
import React from 'react';
import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  bordered?: boolean;
}
const ContentCard = ({ children, bordered = false }: ContentCardProps) => (
  <Card bordered={bordered}>
    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
      {children}
    </Space>
  </Card>
);

export default ContentCard;
