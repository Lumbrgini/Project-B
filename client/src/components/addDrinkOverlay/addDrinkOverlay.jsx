import './addDrinkOverlay.module.css'
import { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAlcCalc } from '/src/hooks/useAlcCalc'

const AddDrinkOverlay = (onClose) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { calculateCrates } = useAlcCalc();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const totalCrates = calculateCrates(values.ingredients);

            const payload = { name: values.name, ingredients: values.ingredients, cratesNum: totalCrates};
            //onSubmit(payload); // Code stump, extend later for backend communication
            console.log(payload.name + ' / ' + payload.cratesNum)
            console.log(payload.ingredients)
            form.resetFields();

            onClose;
            setIsModalOpen(false);
        } catch (err) {
            console.log(err)
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                add a drink
            </Button>
            <Modal
                title={t('add_drink.title')}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form layout="vertical" form={form} initialValues={{ name: '', ingredients: [{ volume: null, unit: 'ml', abv: null }]}}>
                    <Form.Item  label="Drink Name" name="name" rules={[{require: true}]}>
                        <input type="text" placeholder="e.g., Mojito"/>
                    </Form.Item>
                    <Form.List name="ingredients" >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} align="baseline">
                                        <Form.Item {...restField} name={[name, 'volume']} rules={[{ required: true }]}>
                                            <InputNumber placeholder="Volume" min={0} style={{ width: 100 }} />
                                        </Form.Item>

                                        <Form.Item {...restField} name={[name, 'unit']} >
                                            <Select style={{ width: 80 }}>
                                                <Select.Option value="ml">ml</Select.Option>
                                                <Select.Option value="l">L</Select.Option>
                                                <Select.Option value="oz">oz</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item {...restField} name={[name, 'abv']} rules={[{ required: true }]} >
                                            <InputNumber placeholder="ABV %" min={0} max={100} style={{ width: 100 }} />
                                        </Form.Item>

                                        <Button onClick={() => remove(name)} type="link" danger>Remove</Button>
                                    </Space>
                                ))}

                                <Form.Item>
                                <Button type="dashed" onClick={() => add()} block>
                                    + Add Liquid
                                </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </>
    );
};

export default AddDrinkOverlay