import { Layout, ConfigProvider, theme as antTheme } from 'antd';
import { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import MessageValidator from './components/MessageValidator/MessageValidator';

const SIDER_WIDTH = 240;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#141414' : '#f5f5f5';
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const theme = {
    algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 6,
    },
    components: {
      Layout: {
        bodyBg: isDarkMode ? '#141414' : '#f5f5f5',
        siderBg: isDarkMode ? '#141414' : '#ffffff',
      },
      Card: {
        colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      },
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <Layout hasSider>
        <Sidebar isDarkMode={isDarkMode} onThemeChange={toggleTheme} />
        <Layout
          style={{
            transition: 'all 0.2s',
            marginLeft: SIDER_WIDTH,
            minHeight: '100vh',
            background: theme.components.Layout.bodyBg,
          }}
        >
          <Layout.Content
            style={{
              padding: 24,
              minHeight: 280,
              overflow: 'auto',
            }}
          >
            <MessageValidator />
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;