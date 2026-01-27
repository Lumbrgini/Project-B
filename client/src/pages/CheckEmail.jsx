import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button, Space } from 'antd';

const { Title, Text } = Typography;

export default function CheckEmail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', paddingTop: 48 }}>
      <Title level={2}>Check your email (console)</Title>
      <Space direction="vertical">
        <Text>
          We sent you an activation link. Please open it to confirm your registration.
        </Text>
        {email && <Text type="secondary">Email: {email}</Text>}

        <Button type="primary" onClick={() => navigate('/login')}>
          Go to login
        </Button>
      </Space>
    </div>
  );
}
