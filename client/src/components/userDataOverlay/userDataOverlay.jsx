import { useState } from 'react';
import { Modal, Button, Form, InputNumber, message } from 'antd';
import { useTranslation } from 'react-i18next';

const UserDataOverlay = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => setIsModalOpen(true);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await fetch('/api/profile', {
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
        <Form
          layout="vertical"
          form={form}
        >
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