import { Layout, Button, theme } from 'antd';
import { FileTextOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import styled from '@emotion/styled';

const { Sider } = Layout;

const SIDER_WIDTH = 240;

const StyledSider = styled(Sider)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-right: 1px solid ${props => props.borderColor};
    background: ${props => props.siderBg};
  }

  // Logo container
  .brand {
    height: 64px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${props => props.borderColor};
    background: ${props => props.siderBg};
    flex-shrink: 0; /* Prevent shrinking */

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;

      img {
        height: 32px;
        margin-right: 12px;
      }

      .title {
        font-size: 18px;
        font-weight: 600;
        line-height: 1;
        color: ${props => props.textColor};
      }
    }
  }

  // Menu items container
  .menu-container {
    flex: 1;
    padding: 8px;
    background: ${props => props.siderBg};
    overflow-y: auto; /* Allow scrolling if menu items overflow */
    
    /* Customize scrollbar for webkit browsers */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
    }
  }

  // Menu item styling
  .menu-item {
    height: 40px;
    padding: 0 16px;
    margin: 4px 0;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: all 0.2s;
    cursor: pointer;
    color: ${props => props.textColor};

    &:hover {
      background: ${props => props.hoverBg};
    }

    &.selected {
      background: ${props => props.selectedBg};
      color: ${props => props.primaryColor};

      .icon, .code, .text {
        color: ${props => props.primaryColor};
      }
    }

    .icon {
      font-size: 16px;
      margin-right: 12px;
    }

    .menu-content {
      display: flex;
      align-items: baseline;
      gap: 8px;

      .code {
        font-family: monospace;
        font-size: 12px;
        font-weight: 600;
      }

      .text {
        font-size: 14px;
        line-height: 1;
      }
    }
  }

  // Theme toggle container
  .theme-toggle {
    padding: 16px 24px;
    text-align: left;
    border-top: 1px solid ${props => props.borderColor};
    background: ${props => props.siderBg};
    flex-shrink: 0; /* Prevent shrinking */

    .toggle-button {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: flex-start;
      color: ${props => props.textColor};
      
      &:hover {
        background: ${props => props.hoverBg};
      }

      .anticon {
        margin-right: 8px;
      }
    }
  }
`;

const Sidebar = ({ isDarkMode, onThemeChange }) => {
  // Use Ant Design's theme tokens
  const { token } = theme.useToken();

  // Define theme-specific colors
  const themeColors = {
    siderBg: isDarkMode ? token.colorBgContainer : '#ffffff',
    textColor: token.colorText,
    borderColor: token.colorBorder,
    hoverBg: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    selectedBg: isDarkMode ? 'rgba(22, 119, 255, 0.15)' : token.controlItemBgActive,
    primaryColor: token.colorPrimary,
  };

  return (
    <StyledSider
      width={SIDER_WIDTH}
      theme={isDarkMode ? 'dark' : 'light'}
      {...themeColors}
    >
      <div className="brand">
        <a href="/" className="logo-link">
          <img src="profile-pic.png" alt="Open Payments" />
          <span className="title">Open Payments</span>
        </a>
      </div>

      <div className="menu-container">
        <div className="menu-item selected">
          <FileTextOutlined className="icon" />
          <div className="menu-content">
            <span className="text">Payment Validation</span>
          </div>
        </div>
      </div>

      <div className="theme-toggle">
        <Button 
          type="text"
          className="toggle-button"
          icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
          onClick={onThemeChange}
        >
          {isDarkMode ? 'Light theme' : 'Dark theme'}
        </Button>
      </div>
    </StyledSider>
  );
};

export default Sidebar;