import { Layout, Menu, Button, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  MoneyCollectOutlined,
  ApiOutlined,
  GithubOutlined,
  LinkOutlined,
  HomeOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';

const { Sider } = Layout;

const items = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: 'validators',
    label: 'Validators',
    icon: <ApiOutlined />,
    children: [
      {
        key: 'iso20022',
        icon: <MoneyCollectOutlined />,
        label: <Link to="/iso20022">ISO20022 Validator</Link>,
      },
      {
        key: 'fednow',
        icon: <MoneyCollectOutlined />,
        label: <Link to="/fednow">FedNow Validator</Link>,
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'links',
    label: 'Links',
    children: [
      {
        key: 'docs',
        icon: <LinkOutlined />,
        label: <a href="http://openpayments.tech" target="_blank" rel="noopener noreferrer">API Documentation</a>,
      },
      {
        key: 'github',
        icon: <GithubOutlined />,
        label: <a href="https://github.com/Open-Payments" target="_blank" rel="noopener noreferrer">Repository</a>,
      },
    ],
  },
];

const Sidebar = ({ isDarkMode, onThemeChange }) => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'home';
  const { token } = theme.useToken();

  return (
    <Sider
      width={240}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: token.colorBgContainer,
      }}
      theme={isDarkMode ? 'dark' : 'light'}
    >
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: token.colorBgContainer,
      }}>
        <div style={{
          height: 64,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${token.colorBorder}`,
          backgroundColor: token.colorBgContainer,
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}>
            <img src="/profile-pic.png" alt="Open Payments" style={{
              height: 32,
              marginRight: 12,
            }} />
            <span style={{
              fontSize: 18,
              fontWeight: 600,
              color: token.colorText,
            }}>Open Payments</span>
          </Link>
        </div>

        <div style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: token.colorBgContainer,
        }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['validators']}
            items={items}
            style={{ 
              borderRight: 0,
              backgroundColor: token.colorBgContainer,
            }}
            theme={isDarkMode ? 'dark' : 'light'}
          />
        </div>

        <div style={{
          padding: '16px',
          borderTop: `1px solid ${token.colorBorder}`,
          backgroundColor: token.colorBgContainer,
        }}>
          <Button
            type="text"
            icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
            onClick={onThemeChange}
            style={{
              width: '100%',
              textAlign: 'left',
              height: 40,
              color: token.colorText,
            }}
          >
            {isDarkMode ? 'Light theme' : 'Dark theme'}
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;