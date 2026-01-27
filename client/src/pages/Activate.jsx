import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Typography, Spin } from 'antd';

const { Title, Text } = Typography;

export default function Activate() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5173/api/register/${token}`, {
          method: 'PUT',
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || data.message || 'Activation failed.');
        }
        navigate('/login', { replace: true });
      } catch (e) {
        setError(e.message || 'Something went wrong.');
      }
    })();
  }, [token, navigate]);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', paddingTop: 48 }}>
      <Title level={2}>Activating…</Title>
      {error ? (
        <Alert type="error" showIcon message={error} />
      ) : (
        <>
          <Spin />
          <div style={{ marginTop: 12 }}>
            <Text>Confirming your account…</Text>
          </div>
        </>
      )}
    </div>
  );
}
