import { Typography, Card } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Card bordered={false}>
      <Title level={2}>Welcome to Open Payments Validator</Title>
      <Paragraph>
        Choose a validator from the sidebar to get started:
      </Paragraph>
      <ul>
        <li>
          <Link to="/iso20022">ISO20022 Message Validator</Link>
        </li>
        <li>
          <Link to="/fednow">FedNow Message Validator</Link>
        </li>
      </ul>
    </Card>
  );
};

export default Home;