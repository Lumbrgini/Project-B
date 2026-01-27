import { useState, useEffect } from 'react';
import { Modal, Button, Form, InputNumber, message } from 'antd';
import { useTranslation } from 'react-i18next';

const UserDataOverlay = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState(null);
      
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
  
    fetch('/api/home', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(async res => {
        if (res.status === 401) {
          //console.warn('Unauthorized, maybe token expired');
          setUserData(null);
          return null;
        }

        if (!res.ok) {
          console.error('Fetch failed:', res.status);
          setUserData(null);
          return null;
        }

        // parse JSON directly
        const raw = await res.json();
        return raw;
      })
      .then(raw => {
        if (!raw) return;

        const normalized = {
          id: raw.id,
          firstName: raw.first_name,
          lastName: raw.family_name,
          height: raw.height,
          weight: raw.weight,
          age: raw.age,
          drinks: Array.isArray(raw.drinks) ? raw.drinks.map(d => ({
            name: d.name,
            timestamp: new Date(d.timestamp).getTime(),
            ingredients: d.ingredients.map(ing => ({
              volume: ing.volume,
              unit: ing.unit,
              abv: ing.abv,
            })),
          })) : [],
        };
            
        setUserData(normalized);
      })
      .catch(err => {
        console.error(err);
        setUserData(null);
      });
  }, []); 


  const showModal = () => {
    if (userData) {
      form.setFieldsValue({
        age: userData.age,
        height: userData.height,
        weight: userData.weight,
      });
    }

    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          age: values.age,
          height: values.height,
          weight: values.weight,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'UPDATE_FAILED');
      }

      message.success(t('profile.updated_successfully'));
      form.resetFields();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      message.error(t('profile.update_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {t('profile.edit')}
      </Button>

      <Modal
        title={t('profile.edit')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        centered
        width={480}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label={t('profile.age')}
            name="age"
            rules={[
              { required: true, message: t('profile.age_required') },
              { type: 'number', min: 1, max: 120 },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={t('profile.height_cm')}
            name="height"
            rules={[
              { required: true, message: t('profile.height_required') },
              { type: 'number', min: 50, max: 250 },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={t('profile.weight_kg')}
            name="weight"
            rules={[
              { required: true, message: t('profile.weight_required') },
              { type: 'number', min: 20, max: 300 },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>

      </Modal>
    </>
  );
};

export default UserDataOverlay;
