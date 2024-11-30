import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const { Content } = Layout;
interface AppLayoutProps {
  isDarkMode: boolean;
  onThemeChange: () => void;
}
const AppLayout = ({ isDarkMode, onThemeChange }:AppLayoutProps) => {
  return (
    <Layout hasSider>
      <Sidebar isDarkMode={isDarkMode} onThemeChange={onThemeChange} />
      <Layout style={{ marginLeft: 240, minHeight: '100vh' }}>
        <Content style={{ padding: 24, minHeight: 280, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
