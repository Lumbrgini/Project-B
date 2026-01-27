import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Typography, Space } from 'antd';

const { Title, Text } = Typography;

function Register() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(values) {
    setError(null);

    const payload = {
      firstName: values.firstName.trim(),
      familyName: values.familyName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };

    try {
      const registerRes = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!registerRes.ok) {
        const data = await registerRes.json().catch(() => ({}));

        if (registerRes.status === 409) {
          throw new Error('This e-mail address is already registered.');
        }

        if (registerRes.status === 400) {
          throw new Error(
            data.error || data.message || 'Invalid registration data.',
          );
        }

        throw new Error(
          data.error || data.message || 'Registration failed. Please try again.',
        );
      }

      const tokenRes = await fetch('http://localhost:3000/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          username: payload.email,
          password: payload.password,
          client_id: 'client',
        }),
      });

      if (!tokenRes.ok) {
        const data = await tokenRes.json().catch(() => ({}));
        throw new Error(
          data.error ||
            'Registration succeeded, but automatic login failed.',
        );
      }

      const tokenData = await tokenRes.json();

      localStorage.setItem('accessToken', tokenData.access_token);
      localStorage.setItem('refreshToken', tokenData.refresh_token);

      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', paddingTop: 48 }}>
      <Title level={2}>Register</Title>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label="First name"
          name="firstName"
          rules={[
            { required: true, message: 'First name is required.' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Family name"
          name="familyName"
          rules={[
            { required: true, message: 'Family name is required.' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'E-mail is required.' },
            { type: 'email', message: 'Please enter a valid e-mail address.' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Password is required.' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>

      <Space direction="vertical" size="small" style={{ marginTop: 16 }}>
        <Text>Already have an account?</Text>
        <Button type="link" onClick={() => navigate('/login')}>
          Go to login
        </Button>
      </Space>
    </div>
  );
}

export default Register;
